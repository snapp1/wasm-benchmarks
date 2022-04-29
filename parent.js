var benchmarkId = 0;

async function sendData() {
  var data = await fetch("http://localhost:8000/data.json");

  var sampleData = await data.json();
  document.getElementById("child").contentWindow.postMessage(sampleData, '*'); 
}

async function sendJSON() {
  const files = ["1MB", "10MB", "105MB", "210MB"];

  var results = {"1MB" : [], "10MB" : [], "105MB" : [], "210MB" : []};
  
  for (const file of files) {
    for(var i = 0; i < 10; i ++){
      var t1 = Date.now();
      var data = await fetch("http://localhost:8000/" + file + ".json");

      var t2 = Date.now();

      var dataJs = await data.json();

      var t3 = Date.now();

      document.getElementById("childVanilaJs").contentWindow.postMessage(dataJs, '*');

      var t4 = Date.now();

      results[file].push({
          "name": "Vanilla js",
          "filesize": file,
          "lib size": 0,
          "fetch time": t2-t1,
          "parse time": t3-t2,
          "postMessage execution time": t4-t3,
          "postMessage decode time": 0,
          "content render time": localStorage.getItem("t7") - localStorage.getItem("t6"),
          "TOTAL TIME:" : localStorage.getItem("t7") - t1
      });
    }
  }

  downloadToFile(JSON.stringify(results, null, '\t'), "Vanilla js", "text/plain");
}

async function sendBinary() {
  const files = ["0.69MB", "7MB", "70MB", "140MB"];

  var results = {"0.69MB" : [], "7MB" : [], "70MB" : [], "140MB" : []};
  
  for (const file of files) {
    for(var i = 0; i < 10; i ++){
      var t1 = Date.now();
      var dataFetch = await fetch("http://localhost:8000/" + file + ".bin");

      var t2 = Date.now();

      var data = new Uint8Array(await (await dataFetch.blob()).arrayBuffer());

      var t3 = Date.now();

      document.getElementById("childBinaryJs").contentWindow.postMessage(data, '*');

      var t4 = Date.now();

      results[file].push({
          "name": "Vanilla js + Binary + MessagePack",
          "filesize": file,
          "lib size": "16kB",
          "fetch time": t2-t1,
          "parse time": t3-t2,
          "postMessage execution time": t4-t3,
          "messagePack decode time": localStorage.getItem("t6") - localStorage.getItem("t5"),
          "content render time": localStorage.getItem("t7") - localStorage.getItem("t6"),
          "TOTAL TIME:" : localStorage.getItem("t7") - t1
      });
    }
  }

  downloadToFile(JSON.stringify(results, null, '\t'), "Vanilla js + Binary + MessagePack", "text/plain");
}

async function sendArrayBuffer() {
  const files = ["0.69MB", "7MB", "70MB", "140MB"];

  var results = {"0.69MB" : [], "7MB" : [], "70MB" : [], "140MB" : []};
  
  for (const file of files) {
    for(var i = 0; i < 10; i ++){
      var t1 = Date.now();
      var dataFetch = await fetch("http://localhost:8000/" + file + ".bin");

      var t2 = Date.now();

      var data = await (await dataFetch.blob()).arrayBuffer();

      var t3 = Date.now();

      document.getElementById("childArrayBufferJs").contentWindow.postMessage(data, '*', [data]);

      var t4 = Date.now();

      results[file].push({
          "name": "Vanilla js + Binary(ArrayBuffer) + MessagePack",
          "filesize": file,
          "lib size": "16kB",
          "fetch time": t2-t1,
          "parse time": t3-t2,
          "postMessage execution time": t4-t3,
          "messagePack decode time": localStorage.getItem("t6") - localStorage.getItem("t5"),
          "content render time": localStorage.getItem("t7") - localStorage.getItem("t6"),
          "TOTAL TIME:" : localStorage.getItem("t7") - t1
      });
    }
  }

  //console.log(JSON.stringify(results, null, '\t'));
  downloadToFile(JSON.stringify(results, null, '\t'), "Vanilla js + Binary(ArrayBuffer) + MessagePack", "text/plain");
}

async function startBenchmarks() {

  await sendJSON();
  
  await sendBinary();    

  await sendArrayBuffer();
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