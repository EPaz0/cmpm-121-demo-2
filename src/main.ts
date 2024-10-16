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
const points: Array<{x: number; y: number }> = [];


//Start drawing
canvas.addEventListener("mousedown", (event) => 
{
    isDrawing = true;
    points.push({ x: event.offsetX, y: event.offsetY });
    canvas.dispatchEvent(new Event("drawing-changed"));
});

//Draw as the mouse moves
canvas.addEventListener("mousemove", (event) => {
    if (isDrawing) 
        {
        points.push({ x: event.offsetX, y: event.offsetY });
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
});

//Stop drawing
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    //context.closePath();
});

//Observer tp redraw lines when "drawing-changed" event is dispatched
canvas.addEventListener("drawing-changed", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    for (let i = 1; i < points.length; i++) {
      const { x: prevX, y: prevY } = points[i - 1];
      const { x, y } = points[i];
      context.moveTo(prevX, prevY);
      context.lineTo(x, y);
      context.stroke();
    }
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