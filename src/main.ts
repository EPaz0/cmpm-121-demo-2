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

//let isDrawing = false;
const lines: Array<Array<{ x: number; y: number }>> = [];
const redoLines: Array<Array<{ x: number; y: number }>> = [];
let currentLine: Array<{ x: number; y: number }> | null = null;
const cursor = { active: false, x: 0, y: 0 };


//Start drawing
canvas.addEventListener("mousedown", (event) => 
{
    cursor.active = true;
    cursor.x = event.offsetX;
    cursor.y = event.offsetY;

    currentLine = [{ x: cursor.x, y: cursor.y }];
    lines.push(currentLine);
    redoLines.length = 0; // Clear redo stack

    redraw();
});

  // Continue drawing the current line
  canvas.addEventListener("mousemove", (event) => {
    if (cursor.active && currentLine) {
      cursor.x = event.offsetX;
      cursor.y = event.offsetY;
      currentLine.push({ x: cursor.x, y: cursor.y });

      redraw();
    }
  });

//Stop drawing
canvas.addEventListener("mouseup", () => {
    cursor.active = false;
    currentLine = null;
});

  // Redraw all lines on the canvas
  function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const line of lines) {
      if (line.length > 1) {
        context.beginPath();
        const { x, y } = line[0];
        context.moveTo(x, y);
        for (const point of line) {
          context.lineTo(point.x, point.y);
        }
        context.stroke();
      }
    }
  }



// Button Container
const buttonContainer = document.createElement("div");
buttonContainer.classList.add("button-container");

//Clear the canvas
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.style.marginTop = "10px";
clearButton.onclick = () => {
    lines.length = 0;
    redoLines.length = 0;
    redraw();
}
buttonContainer.appendChild(clearButton);

//Undo button
// Undo Button (Undo last line)
const undoButton = document.createElement("button");
undoButton.textContent = "Undo";
undoButton.style.marginTop = "10px";
undoButton.onclick = () => {
  if (lines.length > 0) {
    redoLines.push(lines.pop()!);
    redraw();
  }
};
buttonContainer.appendChild(undoButton);

//Redo button
const redoButton = document.createElement("button");
redoButton.textContent = "Redo";
redoButton.style.marginTop = "10px";
redoButton.onclick = () => {
  if (redoLines.length > 0) {
    lines.push(redoLines.pop()!);
    redraw();
  }
};
buttonContainer.appendChild(redoButton);

app.appendChild(buttonContainer);