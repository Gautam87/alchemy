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

let app = undefined;
let stats = new Stats();

/**
 * The main render loop of the window
 */
function renderLoop() {
    window.requestAnimationFrame(renderLoop);
    if (app) {
        stats.begin();
        app.render();
        stats.end();
    }
}

/**
 * This is callback setup when window is loaded
 */
window.onload = function () {
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    app = new App(function () {
        renderLoop();
    });
};
