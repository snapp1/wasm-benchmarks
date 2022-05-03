const init = () => {

    window.parent.postMessage({message: 'child is ready'}, '*');
}

document.addEventListener('DOMContentLoaded', init, false);

var t5,t6,t7;

async function receiveData(event){
    t5 = Date.now();
    var data = msgpack.decode(event.data);
    t6 = Date.now();
    document.getElementById("results").innerHTML = JSON.stringify(data[0]);
    t7 = Date.now();
}
  
window.addEventListener("message", receiveData, false);
