/**
 * Created by kunaldawn on 24/6/17.
 */

/**
 *
 */
class Texture {
    /**
     *
     * @param gl
     * @param width
     * @param height
     * @param format
     * @param type
     */
    constructor(gl, id) {
        this.element = document.getElementById(id);
        this.gl = gl;
        this.id = this.gl.createTexture();
        this.width = this.element.getBoundingClientRect().width;
        this.height = this.element.getBoundingClientRect().height;
        this.format = this.gl.RGBA;
        this.type = this.gl.UNSIGNED_BYTE;

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
        this.gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        if (this.width && this.height) {
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, this.format, this.gl.UNSIGNED_BYTE, this.element);
            // this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, this.type, this.element);
        }
    }

    /**
     *
     * @returns {null|WebGLTexture|*}
     */
    getID() {
        return this.id;
    }

    /**
     *
     */
    destroy() {
        this.gl.deleteTexture(this.id);
        this.id = null;
    }

    /**
     *
     * @param unit
     */
    use(unit) {
        this.gl.activeTexture(this.gl.TEXTURE0 + (unit || 0));
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    }

    /**
     *
     * @param unit
     */
    unuse(unit) {
        this.gl.activeTexture(this.gl.TEXTURE0 + (unit || 0));
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
}