/**
 * Created by kunaldawn on 7/7/17.
 */

class Filter {
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

    loadTexture(unit, texture) {
        this.textures[unit] = texture;
    }

    updateParameter(name, value) {
        this.shader.setUniform(name, value);
    }

    render(surface) {
        this.shader.render(surface, this.textures);
    }
}