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

/**
 * Shader filter manager
 */
class Filter {
    /**
     * Constructor of this class
     *
     * @param gl OpenGL context
     * @param vss Bobble formatted vertex shader source
     * @param fss Bobble formatted fragment shader source
     * @param textures number of textures
     */
    constructor(gl, vss, fss, textures) {
        let vertexShaderHeader = `
        #version 100
        precision mediump float;
        attribute vec4 position;
        varying vec2 texture_mapping;
        `;

        let fragmentShaderHeader = `
        #version 100
        precision mediump float;
        varying vec2 texture_mapping;
        `;

        for (let index = 1; index <= textures; index++) {
            fragmentShaderHeader += "uniform sampler2D texture_" + index + ";\n"
        }

        this.vertexShader = vertexShaderHeader + vss;
        this.fragmentShader = fragmentShaderHeader + fss;

        this.gl = gl;
        this.shader = new Shader(this.gl, this.vertexShader, this.fragmentShader);
        this.textures = {};
    }

    /**
     * Load a texture
     *
     * @param unit Texture unit
     * @param texture Texture
     */
    loadTexture(unit, texture) {
        this.textures[unit] = texture;
    }

    /**
     * Update a filter shader parameter
     *
     * @param name Parameter name
     * @param value Parameter value
     */
    updateParameter(name, value) {
        this.shader.setUniform(name, value);
    }

    /**
     * Render this filter on given surface
     *
     * @param surface Surface
     */
    render(surface) {
        this.shader.render(surface, this.textures);
    }
}