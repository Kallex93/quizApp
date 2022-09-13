var w;

function startWorker() {
  if (typeof(Worker) !== "undefined") {
    if (typeof(w) == "undefined") {
      w = new Worker("scripts/timeWebWorker.js");
    }
    w.onmessage = function(event) {
      document.getElementById("time").innerHTML = event.data;
    };
  } else {
    document.getElementById("time").innerHTML = "Sorry! No Web Worker support.";
  }
}

function stopWorker() {

  console.log(typeof(w));

  if(typeof(w) !== "undefined"){
    console.log("Inside worker if");
    w.terminate();
    w = undefined;
  }

  console.log(typeof(w));
  
}