var benchmarkId = 0;
var runsInEachTest = 20;

async function sendData() {
  var data = await fetch("http://localhost:8000/data.json");

  var sampleData = await data.json();
  document.getElementById("child").contentWindow.postMessage(sampleData, '*'); 
}

async function sendJSON() {
  const files = ["1MB", "10MB", "105MB", "210MB"];

  var results = {"1MB" : [], "10MB" : [], "105MB" : [], "210MB" : []};
  
  //Used for convenience to paste to EXCEL
  // var resultFormatted = {"1MB" : {
  //   "fetchtime" : [],
  //   "parsetime" : [],
  //   "postMessageexecutiontime" : [],
  //   "postMessagedecodetime" : [],
  //   "contentrendertime" : [],
  //   "TOTALTIME" : []
  // },
  // "10MB" : {
  //   "fetchtime" : [],
  //   "parsetime" : [],
  //   "postMessageexecutiontime" : [],
  //   "postMessagedecodetime" : [],
  //   "contentrendertime" : [],
  //   "TOTALTIME" : []
  // },
  // "105MB" : {
  //   "fetchtime" : [],
  //   "parsetime" : [],
  //   "postMessageexecutiontime" : [],
  //   "postMessagedecodetime" : [],
  //   "contentrendertime" : [],
  //   "TOTALTIME" : []
  // },
  // "210MB" : {
  //   "fetchtime" : [],
  //   "parsetime" : [],
  //   "postMessageexecutiontime" : [],
  //   "postMessagedecodetime" : [],
  //   "contentrendertime" : [],
  //   "TOTALTIME" : []
  // }};

  for (const file of files) {
    for(var i = 0; i < runsInEachTest; i ++){
      var t1 = Date.now();
      var data = await (await fetch("http://localhost:8000/" + file + ".json")).text();

      var t2 = Date.now();

      var dataJs = JSON.parse(data);

      var t3 = Date.now();

      document.getElementById("childVanilaJs").contentWindow.postMessage(dataJs, '*');

      var t4 = Date.now();

      await delay(0);

      var t6 = document.getElementById("childVanilaJs").contentWindow.t6;
      var t7 = document.getElementById("childVanilaJs").contentWindow.t7;

      results[file].push({
          "name": "Vanilla js",
          "filesize": file,
          "lib size": 0,
          "fetch time": t2-t1,
          "parse time": t3-t2,
          "postMessage execution time": t4-t3,
          "postMessage decode time": 0,
          "content render time": t7 - t6,
          "TOTAL TIME:" : t7 - t1
      });

      // resultFormatted[file]["fetchtime"].push(t2-t1);
      // resultFormatted[file]["parsetime"].push(t3-t2);
      // resultFormatted[file]["postMessageexecutiontime"].push(t4-t3);
      // resultFormatted[file]["postMessagedecodetime"].push(0);
      // resultFormatted[file]["contentrendertime"].push(t7 - t6);
      // resultFormatted[file]["TOTALTIME"].push(t7 - t1);
    }
  }

  downloadToFile(JSON.stringify(results, null, '\t'), "Vanilla js", "text/plain");
  //downloadToFile(JSON.stringify(resultFormatted, null, '\t'), "Vanilla js", "text/plain");
}

async function sendBinary() {
  const files = ["0.69MB", "7MB", "70MB", "140MB"];

  var results = {"0.69MB" : [], "7MB" : [], "70MB" : [], "140MB" : []};
  
  for (const file of files) {
    for(var i = 0; i < runsInEachTest; i ++){
      var t1 = Date.now();
      var dataFetch = await fetch("http://localhost:8000/" + file + ".bin");

      var t2 = Date.now();

      var data = new Uint8Array(await (dataFetch).arrayBuffer());

      var t3 = Date.now();
      
      document.getElementById("childBinaryJs").contentWindow.postMessage(data, '*', [data.buffer]);
      var t4 = Date.now();

      await delay(0);

      var t5 = document.getElementById("childBinaryJs").contentWindow.t5;
      var t6 = document.getElementById("childBinaryJs").contentWindow.t6;
      var t7 = document.getElementById("childBinaryJs").contentWindow.t7;

      results[file].push({
          "name": "Vanilla js + Binary + MessagePack",
          "filesize": file,
          "lib size": "16kB",
          "fetch time": t2-t1,
          "parse time": t3-t2,
          "postMessage execution time": t4-t3,
          "messagePack decode time": t6- t5,
          "content render time": t7 - t6,
          "TOTAL TIME:" : t7 - t1
      });
    }
  }

  downloadToFile(JSON.stringify(results, null, '\t'), "Vanilla js + Binary + MessagePack", "text/plain");
}

async function sendSharedArrayBuffer() {
  const files = ["0.69MB", "7MB", "70MB", "140MB"];

  var results = {"0.69MB" : [], "7MB" : [], "70MB" : [], "140MB" : []};
  
  for (const file of files) {
    for(var i = 0; i < runsInEachTest; i ++){
      var t1 = Date.now();
      var dataFetch = await fetch("http://localhost:8000/" + file + ".bin");

      var t2 = Date.now();

      var data = await dataFetch.arrayBuffer();

      var toCopyFrom = new Uint8Array(data);
      var sharedArrayBuffer = new Uint8Array(new SharedArrayBuffer(data.byteLength));
      sharedArrayBuffer.set(toCopyFrom, 0);

      var t3 = Date.now();

      document.getElementById("childSharedArrayBufferJs").contentWindow.postMessage(sharedArrayBuffer, '*');

      var t4 = Date.now();

      await delay(0);

      var t5 = document.getElementById("childSharedArrayBufferJs").contentWindow.t5;
      var t6 = document.getElementById("childSharedArrayBufferJs").contentWindow.t6;
      var t7 = document.getElementById("childSharedArrayBufferJs").contentWindow.t7;

      results[file].push({
          "name": "Vanilla js + Binary(SharedArrayBuffer) + MessagePack",
          "filesize": file,
          "lib size": "16kB",
          "fetch time": t2-t1,
          "parse time": t3-t2,
          "postMessage execution time": t4-t3,
          "messagePack decode time": t6 - t5,
          "content render time": t7 - t6,
          "TOTAL TIME:" : t7 - t1
      });
    }
  }

  //console.log(JSON.stringify(results, null, '\t'));
  downloadToFile(JSON.stringify(results, null, '\t'), "Vanilla js + Binary(SharedArrayBuffer) + MessagePack", "text/plain");
}

async function startBenchmarks() {

  await sendJSON();
  
  //await sendBinary();    

  //await sendSharedArrayBuffer();
}

function receiveMessage(event){
  console.log('received response: ${event.data} \n sending data back to child' );
  benchmarkId++;
  if(benchmarkId == 3){
    startBenchmarks();
  }
}

window.addEventListener("message", receiveMessage, false);

//Save data on disk.
const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};

//Wait for time milliseconds.
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}