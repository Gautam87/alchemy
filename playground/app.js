class App {
    constructor(config) {
        this.isReverse = false;
        this.time = 0.0;

        this.fragment_shader = `
        precision mediump float;
        uniform sampler2D texture;
        uniform float time;
        varying vec2 tex_pos;
        void main() {
            vec3 color = texture2D(texture, tex_pos).rgb;
            float w = dot(color, vec3(0.25, 0.5, 0.25));
            gl_FragColor = vec4(w * time, w * time, w, 1.0);
        }
        `;

        this.vertex_shader = `
        attribute vec2 vertex;
        varying vec2 tex_pos;
        void main() {
            tex_pos = vertex;
            gl_Position = vec4(vertex * 2.0 - 1.0, 0.0, 1.0);
        }
        `;

        this.canvas = new Canvas(config.canvas);
        this.video = new Camera(config.video);
        this.video.start();

        this.shader = new Shader(this.canvas.getGL(), this.vertex_shader, this.fragment_shader);
    }

    render() {
        if (this.video.isReady()) {
            if (this.time > 1.0) {
                this.isReverse = true;
            }

            if (this.time < 0.0) {
                this.isReverse = false;
            }

            if (this.isReverse) {
                this.time = this.time - 0.01;
            } else {
                this.time = this.time + 0.01;
            }
            
            this.video_texture = new Texture(this.canvas.getGL(), "video");
            this.video_texture.use(0);
            this.shader.setUniform("texture", 0);
            this.shader.setUniform("time", this.time);
            this.shader.render();
            this.video_texture.destroy();
            this.video_texture = null;
        }
        
    }
}

let app = null;
let stats = new Stats();

function render() {
    window.requestAnimationFrame(render);
    if (app) {
        stats.begin();
        app.render();
        stats.end();
    }
}

window.onload = function () {
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
    console.log("window loaded");
    app = new App({"canvas": "canvas", "video": "video"});
    render();
};

