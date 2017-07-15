/**
 *
 *   mm   ""#           #
 *   ##     #     mmm   # mm    mmm   mmmmm  m   m
 *  #  #    #    #"  "  #"  #  #"  #  # # #  "m m"
 *  #mm#    #    #      #   #  #""""  # # #   #m#
 * #    #   "mm  "#mm"  #   #  "#mm"  # # #   "#
 *                                            m"
 *                                           ""
 * Author : Kunal Dawn (kunal@bobblekeyboard.com)
 */

let Filters = {
    no_filter: {
        vs: `
        void main() {
            texture_mapping = position.zw;
            gl_Position = vec4(position.xy, 0.0, 1.0);
        }`,
        fs: `
        void main() {
            gl_FragColor = vec4(texture2D(texture_1, texture_mapping));
        }`
    },
    gray_scale: {
        vs: `
        void main() {
            texture_mapping = position.zw;
            gl_Position = vec4(position.xy, 0.0, 1.0);
        }`,
        fs: `
        const highp vec3 W = vec3(0.2125, 0.7154, 0.0721);
        void main() {
            lowp vec4 textureColor = texture2D(texture_1, texture_mapping);
            float luminance = dot(textureColor.rgb, W);
            gl_FragColor = vec4(vec3(luminance), textureColor.a);
        }`
    },
    hue: {
        vs: `
        void main() {
        texture_mapping = position.zw;
        gl_Position = vec4(position.xy, 0.0, 1.0);
        }`,
        fs: `
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
        }`
    },
    face_blur: {
        vs:`
        void main() {
            texture_mapping = position.zw;
            gl_Position = vec4(position.xy, 0.0, 1.0);
        }`,
        fs: `
        uniform mediump vec2 blurCenter;
        uniform mediump float blurSize;
        void main() {
            vec2 samplingOffset = 1.0/100.0 * (blurCenter - texture_mapping) * blurSize;
            vec4 fragmentColor = texture2D(texture_1, texture_mapping) * 0.18;
            fragmentColor += (texture2D(texture_1, texture_mapping + samplingOffset) * 0.15);
            fragmentColor += (texture2D(texture_1, texture_mapping + (2.0 * samplingOffset)) *  0.12);
            fragmentColor += (texture2D(texture_1, texture_mapping + (3.0 * samplingOffset)) * 0.09);
            fragmentColor += (texture2D(texture_1, texture_mapping + (4.0 * samplingOffset)) * 0.05);
            fragmentColor += (texture2D(texture_1, texture_mapping - samplingOffset) * 0.15);
            fragmentColor += (texture2D(texture_1, texture_mapping - (2.0 * samplingOffset)) *  0.12);
            fragmentColor += (texture2D(texture_1, texture_mapping - (3.0 * samplingOffset)) * 0.09);
            fragmentColor += (texture2D(texture_1, texture_mapping - (4.0 * samplingOffset)) * 0.05);
            gl_FragColor = fragmentColor;
        }`
    },
    poster: {
        vs: `
        void main() {
            texture_mapping = position.zw;
            gl_Position = vec4(position.xy, 0.0, 1.0);
        }`,
        fs: `
        uniform mediump float colorLevels;
        void main() {
            highp vec4 textureColor = texture2D(texture_1, texture_mapping);
            gl_FragColor = floor((textureColor * colorLevels) + vec4(0.5)) / colorLevels;
        }`
    }
};