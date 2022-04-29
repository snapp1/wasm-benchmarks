const init = () => {

    window.parent.postMessage({message: 'child is ready'}, '*');
}

document.addEventListener('DOMContentLoaded', init, false);


async function receiveData(event){
    localStorage.setItem("t6", Date.now());
    document.getElementById("results").innerHTML = JSON.stringify(event.data[0]);
    localStorage.setItem("t7", Date.now());
}
  
  
window.addEventListener("message", receiveData, false);
