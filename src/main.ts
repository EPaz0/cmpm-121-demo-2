import "./style.css";

const APP_NAME = "Sketch";
const app = document.querySelector<HTMLDivElement>("#app")!;

//Set the title of the document
document.title = APP_NAME;

//Create h1 element and set app name
const titleElement = document.createElement("h1");
titleElement.textContent = APP_NAME;
app.appendChild(titleElement);


//Create canvas element
const canvas  = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
// Append the canvas element to the app container
app.appendChild(canvas);


//Get the 2d context of the canvas
const context = canvas.getContext("2d")!;
if(!context) 
{
    throw new Error("2d context not supported");
}

let isDrawing = false;

//Start drawing
canvas.addEventListener("mousedown", (event) => {
    isDrawing = true;
    context.beginPath();
    context.moveTo(event.offsetX, event.offsetY);
});

//Draw as the mouse moves
canvas.addEventListener("mousemove", (event) => {
    if(isDrawing) {
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
    }
});

//Stop drawing
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    context.closePath();
});


//Clear the canvas
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.style.marginTop = "10px";
clearButton.onclick = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
app.appendChild(clearButton);