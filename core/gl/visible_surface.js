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
 * This class is responsible for managing VisibleSurface element and its GL context.
 */
class VisibleSurface extends Surface {
    /**
     * Constructor of this class
     *
     * @param id Element ID if the canvas
     */
    constructor(id) {
        super();
        this.canvas = document.getElementById(id);
        this.gl = null;

        try {
            this.gl = this.canvas.getContext('experimental-webgl', {premultipliedAlpha: false});
        } catch (e) {
            this.gl = null;
            throw 'This browser does not support WebGL';
        }
    }

    /**
     * Set size of the canvas
     *
     * @param width Width of the canvas
     * @param height Height of the canvas
     */
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    /**
     * Get canvas element instance
     *
     * @returns {Element|*} Element
     */
    getElement() {
        return this.canvas;
    }

    /**
     * Get GL Context of the canvas
     *
     * @returns {null|WebGL2RenderingContext|null|CanvasRenderingContext2D|WebGLRenderingContext|*} GL context
     */
    getGL() {
        return this.gl;
    }

    /**
     * Get width of the canvas
     *
     * @returns {string|*|Number|number} width
     */
    getWidth() {
        return this.canvas.width;
    }

    /**
     * Get height of the canvas
     *
     * @returns {string|*|Number|number} height
     */
    getHeight() {
        return this.canvas.height;
    }
}