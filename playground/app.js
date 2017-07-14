class App {
    constructor(config, callback) {
        this.canvas = new VisibleSurface(config.canvas);
        this.video = new Camera(config.video);
        var self = this;
        this.video.start(function () {
            self.canvas.setSize(self.video.getWidth(), self.video.getHeight());
            if (self.filter == undefined) {
                let vss = `
                void main() {
                    texture_mapping = position.zw;
                    gl_Position = vec4(position.xy, 0.0, 1.0);
                }
                `;
                let fss = `
                void main() {
                    gl_FragColor = vec4(texture2D(texture_1, texture_mapping));
                }
                `;
                self.filter = new Filter(self.canvas.getGL(), vss, fss, 1);
            }
            if (callback) {
                callback();
            }
        });
    }

    setParam(name, value) {
        this.filter.updateParameter(name, value);
    }

    setFilter(vss, fss, textures) {
        this.filter = new Filter(this.canvas.getGL(), vss, fss, textures.length + 1);
        for (let index = 1; index <= textures.length; index++) {
            this.filter.loadTexture(index, textures[index - 1]);
        }
    }

    render(time) {
        if (this.video.isReady()) {
            this.video_texture = new Texture(this.canvas.getGL(), "video");
            this.filter.loadTexture(0, this.video_texture);
            this.filter.render(this.canvas);
            this.video_texture.destroy();
            this.video_texture = null;
        }
    }
}

let app = null;
let stats = new Stats();

function renderLoop() {
    window.requestAnimationFrame(renderLoop);
    if (app) {
        stats.begin();
        app.render();
        stats.end();
    }
}

window.onload = function () {
    stats.showPanel(0);
    document.body.appendChild( stats.dom );
    console.log("window loaded");
    app = new App({"canvas": "canvas", "video": "video"}, function () {
        renderLoop();
    });
};

let applyNoFilter = function () {
    let vss = `
    void main() {
        texture_mapping = position.zw;
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
    `;
    let fss = `
    void main() {
        gl_FragColor = vec4(texture2D(texture_1, texture_mapping));
    }
    `;
    app.setFilter(vss, fss, []);
};

let applyGreyFilter = function () {
    let vss = `
    void main() {
        texture_mapping = position.zw;
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
    `;
    let fss = `
    const highp vec3 W = vec3(0.2125, 0.7154, 0.0721);
    void main() {
        lowp vec4 textureColor = texture2D(texture_1, texture_mapping);
        float luminance = dot(textureColor.rgb, W);
        gl_FragColor = vec4(vec3(luminance), textureColor.a);
    }
    `;
    app.setFilter(vss, fss, []);
};

let applyHue = function() {
    let vss = `
    void main() {
        texture_mapping = position.zw;
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
    `;
    let fss = `
    uniform float hueAdjust;
    const highp vec4 kRGBToYPrime = vec4 (0.299, 0.587, 0.114, 0.0);
    const highp vec4 kRGBToI = vec4 (0.595716, -0.274453, -0.321263, 0.0);
    const highp vec4 kRGBToQ = vec4 (0.211456, -0.522591, 0.31135, 0.0);
    const highp vec4 kYIQToR = vec4 (1.0, 0.9563, 0.6210, 0.0);
    const highp vec4 kYIQToG = vec4 (1.0, -0.2721, -0.6474, 0.0);
    const highp vec4 kYIQToB = vec4 (1.0, -1.1070, 1.7046, 0.0);
    void main () {
        highp vec4 color = texture2D(texture_1, texture_mapping);
        highp float YPrime = dot (color, kRGBToYPrime);
        highp float I = dot (color, kRGBToI);
        highp float Q = dot (color, kRGBToQ);
        highp float hue = atan (Q, I);
        highp float chroma = sqrt (I * I + Q * Q);
        hue += (-hueAdjust);
        Q = chroma * sin (hue);
        I = chroma * cos (hue);
        highp vec4 yIQ = vec4 (YPrime, I, Q, 0.0);
        color.r = dot (yIQ, kYIQToR);
        color.g = dot (yIQ, kYIQToG);
        color.b = dot (yIQ, kYIQToB);
        gl_FragColor = color;
    }
    `;
    app.setFilter(vss, fss, []);
    app.setParam("hueAdjust", 0.8);
};