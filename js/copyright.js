// add the current year if it is not the same as the year of publication
if(new Date().getFullYear() !== 2021){

document.getElementById("year").innerHTML = " - " + new Date().getFullYear();

}