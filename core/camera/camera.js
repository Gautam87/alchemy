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
 * This class is responsible for attaching a camera stream to video element.
 */
class Camera {
    /**
     * Constructor of this class
     *
     * @param id Element ID for the video element
     */
    constructor(id) {
        this.width = 0;
        this.height = 0;
        this.video = document.querySelector(id);
    }

    /**
     * Check if video is ready
     *
     * @returns {boolean}
     */
    isReady() {
        return this.video.readyState === this.video.HAVE_ENOUGH_DATA;
    }

    /**
     * Start the camera video, fall back to sample video in case camera error
     *
     * @param callback Function that will be called when video starts playing
     */
    start(callback) {
        const self = this;

        navigator.getMedia = (navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia);

        if (navigator.getMedia) {
            navigator.getMedia(
                {video: true, audio: false},
                function (stream) {
                    if (navigator.mozGetUserMedia) {
                        self.video.mozSrcObject = stream;
                    } else {
                        let vendorURL = window.URL || window.webkitURL;
                        self.video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
                    }
                    self.video.play();
                    self.video.addEventListener('playing', function() {
                        self.width = self.video.videoWidth;
                        self.height = self.video.videoHeight;
                        if (callback) {
                            callback();
                        }
                    }, false);
                },
                function (err) {
                    self.video.loop = true;
                    self.video.src = "assets/sample.mp4";
                    self.video.play();
                    self.video.addEventListener('playing', function() {
                        self.width = self.video.videoWidth;
                        self.height = self.video.videoHeight;
                        if (callback) {
                            callback();
                        }
                    }, false);
                }
            );
        } else {
            self.video.loop = true;
            self.video.src = "assets/sample.mp4";
            self.video.play();
            self.video.addEventListener('playing', function() {
                self.width = self.video.videoWidth;
                self.height = self.video.videoHeight;
                if (callback) {
                    callback();
                }
            }, false);
        }
    }

    /**
     * Get the video element
     *
     * @returns {Element|*} Video element attached to the camera
     */
    getElement() {
        return this.video;
    }

    /**
     * Get width if the video
     *
     * @returns {number|*|Number} Width
     */
    getWidth() {
        return this.width;
    }

    /**
     * Get height of the video
     * @returns {number|Number|*} Height
     */
    getHeight() {
        return this.height;
    }
}