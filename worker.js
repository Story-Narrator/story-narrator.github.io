// worker.js

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = setInterval(function() {
       callback();
       if (++x === repetitions) {
           clearInterval(intervalID);
           self.postMessage("timeout");
       }
    }, delay);
}

// This will be repeated 30 times with 1 second intervals:
setIntervalX(function () {
    self.postMessage("check");
}, 1000, 30);