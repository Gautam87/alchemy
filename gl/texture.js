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
    constructor(gl, width, height, format, type) {
        this.gl = gl;
        this.id = this.gl.createTexture();
        this.width = width;
        this.height = height;
        this.format = format;
        this.type = type;

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        if (width && height) this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
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
     * @param element
     */
    load(element) {
        let element_obj = document.getElementById(element);
        this.width = element.width || element.videoWidth;
        this.height = element.height || element.videoHeight;
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, this.format, this.type, element_obj);
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