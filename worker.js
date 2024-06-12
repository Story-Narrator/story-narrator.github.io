// worker.js

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function() {
       callback();
       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}

// This will be repeated 30 times with 1 second intervals:
setIntervalX(function () {
    self.postMessage("check");
}, 1000, 30);

self.postMessage("timeout");