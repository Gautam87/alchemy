class Camera {
    constructor(id) {
        this.video = document.querySelector(id);
    }

    isReady() {
        return this.video.readyState === this.video.HAVE_ENOUGH_DATA;
    }

    start() {
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
            },
            function (err) {
                console.log("An error occured! " + err);
            }
        );
    }
}