/**
 * Created by kunaldawn on 24/6/17.
 */

/**
 *
 */
class Canvas {
    /**
     *
     * @param id
     */
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.gl = null;

        try {
            this.gl = this.canvas.getContext('experimental-webgl', { premultipliedAlpha: false });
        } catch (e) {
            this.gl = null;
            throw 'This browser does not support WebGL';
        }
    }

    /**
     *
     * @returns {null|WebGL2RenderingContext|null|CanvasRenderingContext2D|WebGLRenderingContext|*}
     */
    getGL() {
        return this.gl;
    }

    /**
     *
     * @param red
     * @param green
     * @param blue
     * @param alpha
     */
    clear(red, green, blue, alpha) {
        this.gl.clearColor(red, green, blue, alpha);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}