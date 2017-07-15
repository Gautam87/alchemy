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
 * Application class that handles bobble alchemy playground.
 */
class App {
    /**
     * Constructor of this class. This basically setups the app logic.
     *
     * @param callback Callback function which is called when setup is done
     */
    constructor(callback) {
        // Setup defaults
        this.isTrackerRunning = false;
        this.isTrackerLayerVisible = false;
        this.isGlassesLayerVisible = false;
        this.isBlurTracking = false;

        // Create visible surface out of canvas element
        this.filter_layer = new VisibleSurface("filter_layer");
        this.tracker_layer = document.getElementById("tracker_layer");
        this.tracker_layer_ctx = this.tracker_layer.getContext("2d");
        this.glasses_layer = document.getElementById("glasses_layer");
        this.glasses_scaling_factor = 1.0;

        // Create a video source from camera
        this.video = new Camera("video");

        // Create a face tracker
        this.tracker = new clm.tracker();

        // Initialize the face tracker
        this.tracker.init();

        // Start the video and prepare other stuff when video is ready to play
        let self = this;
        this.video.start(function () {
            // Setup default filter without any effect
            self.filter = new Filter(self.filter_layer.getGL(), Filters.no_filter.vs, Filters.no_filter.fs, 1);

            // Notify that setup is done
            if (callback) {
                callback();
            }
        });
    }

    /**
     * Set parameter to active filter
     *
     * @param name Name of the parameter
     * @param value Value of the parameter
     */
    setParam(name, value) {
        // Pass the parameter to the filters shader
        this.filter.updateParameter(name, value);
    }

    /**
     * Set given filter source as current active filter
     *
     * @param vss Bobble formatted vertex shader source
     * @param fss Bobble formatted fragment shader source
     * @param textures Textures to be attached to the shader
     */
    setFilter(vss, fss, textures) {
        if (textures) {
            this.filter = new Filter(this.filter_layer.getGL(), vss, fss, textures.length + 1);
            for (let index = 1; index <= textures.length; index++) {
                let texture = new Image();
                texture.src = textures[index - 1];
                this.filter.loadTexture(index, texture);
            }
        } else {
            this.filter = new Filter(this.filter_layer.getGL(), vss, fss, 1);
        }
    }

    /**
     * Apply no filter
     */
    applyNoFilter() {
        this.isBlurTracking = false;
        this.setFilter(Filters.no_filter.vs, Filters.no_filter.fs, []);
    }

    /**
     * Apply GaryScale filter
     */
    applyGrayFilter() {
        this.isBlurTracking = false;
        this.setFilter(Filters.gray_scale.vs, Filters.gray_scale.fs, []);
    }

    /**
     * Apply hue filter
     */
    applyHueFilter() {
        this.isBlurTracking = false;
        this.setFilter(Filters.hue.vs, Filters.hue.fs, []);
        this.setParam("hueAdjust", 2.5);
    }

    /**
     * Apply poster filter
     */
    applyPosterFilter() {
        this.isBlurTracking = false;
        this.setFilter(Filters.poster.vs, Filters.poster.fs, []);
        this.setParam("colorLevels", 5.5);
    }

    /**
     * Apply blur filter
     */
    applyBlurFilter() {
        this.isBlurTracking = true;
        this.setFilter(Filters.face_blur.vs, Filters.face_blur.fs, []);
        this.setParam("blurCenter", [0.5, 0.5]);
        this.setParam("blurSize", 3.5);
    }

    /**
     * Toggle the face tracker
     */
    toggleTracker() {
        if (this.isTrackerRunning) {
            // Stop tracker
            this.tracker.stop();
            this.isTrackerRunning = false;
        } else {
            // Start the face tracker
            this.tracker.start(this.video.getElement());
            this.isTrackerRunning = true;
        }
    }

    /**
     * Toggle visibility of the tracking layer
     */
    toggleTrackerLayerVisibility() {
        this.isTrackerLayerVisible = !this.isTrackerLayerVisible;
    }

    /**
     * Toggle the visibility of glass layer
     */
    toggleGlassLayer() {
        this.isGlassesLayerVisible = !this.isGlassesLayerVisible;
        if (this.isGlassesLayerVisible) {
            this.glasses_layer.style.display = 'block';
        } else {
            this.glasses_layer.style.display = 'none';
        }
    }

    /**
     * Translate glass to center of eye
     */
    translateGlassesImage() {
        let glasses_elements = document.getElementsByTagName("Transform");
        let dx = (320 - this.tracker.getCurrentPosition()[33][0]) / 28;
        let dy = (240 - this.tracker.getCurrentPosition()[33][1]) / 96;
        dy = dy - (0.3 * this.glasses_scaling_factor);
        dx = dx * -1;
        for (let i = 0; i < glasses_elements.length; i++) {
            glasses_elements[i].translation = dx + " " + dy + " 0";
        }
    }

    /**
     * Scale glass according to eye distance
     */
    scaleGlassesImage() {
        let glasses_elements = document.getElementsByTagName("Transform");
        let targetWidth = this.tracker.getCurrentPosition()[14][0] - this.tracker.getCurrentPosition()[0][0];
        let sourceWidth = 480.0;
        this.glasses_scaling_factor = Math.sqrt(targetWidth / sourceWidth);
        for (let i = 0; i < glasses_elements.length; i++) {
            glasses_elements[i].scale = this.glasses_scaling_factor + " " + this.glasses_scaling_factor + " " + this.glasses_scaling_factor;
        }
    }

    /**
     * Render all layers
     */
    render() {
        if (this.video.isReady()) {
            // Render filter layer
            this.video_texture = new Texture(this.filter_layer.getGL(), "video");
            this.filter.loadTexture(0, this.video_texture);
            this.filter.render(this.filter_layer);
            this.video_texture.destroy();
            this.video_texture = null;

            // Clear tracker layer and render to it if visible
            this.tracker_layer_ctx.clearRect(0, 0, this.tracker_layer.width, this.tracker_layer.height);
            if (this.isTrackerLayerVisible && this.tracker.getCurrentPosition()) {
                this.tracker.draw(this.tracker_layer);
            }

            // Scale and translate glasses if its visible
            if (this.isGlassesLayerVisible && this.tracker.getCurrentPosition()) {
                this.scaleGlassesImage();
                this.translateGlassesImage();
            }

            if (this.isBlurTracking &&  this.tracker.getCurrentPosition()) {
                let dx = this.tracker.getCurrentPosition()[33][0] / 640;
                let dy = this.tracker.getCurrentPosition()[33][1] / 480;
                this.setParam("blurCenter", [dx, dy]);
            }
        }
    }
}