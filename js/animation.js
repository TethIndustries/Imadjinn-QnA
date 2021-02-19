var actTitle = document.getElementById("current-act");
var checkbox = document.getElementById("animation");


//Toggles the usage of the title animation for performance reasons
function toggleAnimation(){
    if (checkbox.checked){
        actTitle.classList.add("focus-in-contract-bck");
        void actTitle.offsetWidth;
    } else {
        actTitle.classList.remove("focus-in-contract-bck");
    }
};

//The function below replays the title animation if the checkbox is activated
function animateAct(){

    if (checkbox.checked){
        // -> removing the class
        actTitle.classList.remove("focus-in-contract-bck");
        
        void actTitle.offsetWidth;
        
        // -> and re-adding the class
        actTitle.classList.add("focus-in-contract-bck");
    }

}