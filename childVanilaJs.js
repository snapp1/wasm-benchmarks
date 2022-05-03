const init = () => {

    window.parent.postMessage({message: 'child is ready'}, '*');
}

document.addEventListener('DOMContentLoaded', init, false);

var t6,t7;

async function receiveData(event){
    t6 = Date.now();
    document.getElementById("results").innerHTML = JSON.stringify(event.data[0]);
    t7 = Date.now();
}
  
  
window.addEventListener("message", receiveData, false);
