var w;

function startWorker() {
  if (typeof(Worker) !== "undefined") {
    if (typeof(w) == "undefined") {
      w = new Worker("timeWebWorker.js");
    }
    w.onmessage = function(event) {
      document.getElementById("time").innerHTML = event.data;
    };
  } else {
    document.getElementById("time").innerHTML = "Sorry! No Web Worker support.";
  }
}

function stopWorker() {
  w.terminate();
  w = undefined;
}