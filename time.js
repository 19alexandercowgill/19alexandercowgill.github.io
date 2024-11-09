function update(){
    // Get the time element
var timeElement = document.getElementById("time");
// Get the current time
var currentTime = new Date().toLocaleTimeString();
currentTime = currentTime.substring(0, currentTime.length - 3)
// Update the time element
timeElement.textContent = currentTime;
}
setInterval(update, 1000);