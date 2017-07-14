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
        this.unit_mappings = {
            0: this.gl.TEXTURE0,
            1: this.gl.TEXTURE1,
            2: this.gl.TEXTURE2,
            3: this.gl.TEXTURE3,
            4: this.gl.TEXTURE4,
            5: this.gl.TEXTURE5,
            6: this.gl.TEXTURE6,
            7: this.gl.TEXTURE7
        };

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
        this.gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        if (this.width && this.height) {
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, this.format, this.gl.UNSIGNED_BYTE, this.element);
        }
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
        if (unit in this.unit_mappings) {
            this.gl.activeTexture(this.unit_mappings[unit]);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
        }
    }

    /**
     *
     * @param unit
     */
    unuse(unit) {
        if (unit in this.unit_mappings) {
            this.gl.activeTexture(this.unit_mappings[unit]);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
    }
}