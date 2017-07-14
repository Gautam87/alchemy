class Camera {
    constructor(id) {
        this.width = 0;
        this.height = 0;
        this.video = document.querySelector(id);
    }

    isReady() {
        return this.video.readyState === this.video.HAVE_ENOUGH_DATA;
    }

    start(callback) {
        const self = this;

        navigator.getMedia = (navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia);

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
                console.log("An error occurred! " + err);
            }
        );
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}