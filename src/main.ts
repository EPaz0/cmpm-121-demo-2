import "./style.css";

const APP_NAME = "Sketch";
const app = document.querySelector<HTMLDivElement>("#app")!;

// Set the title of the document
document.title = APP_NAME;

// Create h1 element and set app name
const titleElement = document.createElement("h1");
titleElement.textContent = APP_NAME;
app.appendChild(titleElement);

class Line {
  private points: { x: number; y: number }[] = [];
  private thickness: number;

  constructor(startX: number, startY: number, thickness: number) {
    this.points = [{ x: startX, y: startY }];
    this.thickness = thickness;
  }

  // Add new point to line
  drag(x: number, y: number) {
    this.points.push({ x, y });
  }

  // Display the line on the canvas
  display(ctx: CanvasRenderingContext2D) {
    if (this.points.length > 1) {
      ctx.lineWidth = this.thickness; // Set the thickness
      ctx.beginPath();
      const { x, y } = this.points[0];
      ctx.moveTo(x, y);
      for (const point of this.points) {
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }
  }
}

// Array to store all lines
const lines: Line[] = [];
const redoLines: Line[] = [];
let currentLine: Line | null = null;

// Default marker thickness (medium thickness by default)
let currentThickness: number = 3;
let selectedTool: string | null = null; // Track the selected tool

// Create canvas element
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
// Append the canvas element to the app container
app.appendChild(canvas);

// Get the 2d context of the canvas
const context = canvas.getContext("2d")!;
if (!context) {
  throw new Error("2d context not supported");
}

const cursor = { active: false, x: 0, y: 0 };

// Start drawing
canvas.addEventListener("mousedown", (event) => {
  if (currentThickness === null) {
    console.log("No tool selected!"); // Debug log
    return; // Prevent drawing if no tool selected
  }
  cursor.active = true;
  cursor.x = event.offsetX;
  cursor.y = event.offsetY;

  // Create a new line object with current thickness
  currentLine = new Line(cursor.x, cursor.y, currentThickness);
  lines.push(currentLine);
  redoLines.length = 0; // Clear redo stack

  redraw();
});

// Continue drawing the current line
canvas.addEventListener("mousemove", (event) => {
  if (cursor.active && currentLine) {
    cursor.x = event.offsetX;
    cursor.y = event.offsetY;
    currentLine.drag(cursor.x, cursor.y);

    redraw();
  }
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
  cursor.active = false;
  currentLine = null;
});

// Redraw all lines on the canvas
function redraw() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Use 'context' here
  for (const line of lines) {
    line.display(context); // Call the display method of each Line
  }
}

// Button Container
const buttonContainer = document.createElement("div");
buttonContainer.classList.add("button-container");

// Clear the canvas
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.style.marginTop = "10px";
clearButton.onclick = () => {
  lines.length = 0;
  redoLines.length = 0;
  redraw();
};
buttonContainer.appendChild(clearButton);

// Undo button
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

// Redo button
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

// Thin Marker Button
const thinButton = document.createElement("button");
thinButton.textContent = "Thin Marker";
thinButton.onclick = () => {
  if (selectedTool === "thin") {
    // Deselect tool
    currentThickness = 3; // Reset back to medium thickness
    selectedTool = null;
    thinButton.classList.remove("selectedTool"); // Remove selected style
  } else {
    // Select thin marker
    currentThickness = 1; // Set the thickness to thin
    selectedTool = "thin";
    thinButton.classList.add("selectedTool"); // Apply selected style
    thickButton.classList.remove("selectedTool"); // Remove thick button's style
  }
};
buttonContainer.appendChild(thinButton);

// Thick Marker Button
const thickButton = document.createElement("button");
thickButton.textContent = "Thick Marker";
thickButton.onclick = () => {
  if (selectedTool === "thick") {
    // Deselect tool
    currentThickness = 3; // Reset back to medium thickness
    selectedTool = null;
    thickButton.classList.remove("selectedTool"); // Remove selected style
  } else {
    // Select thick marker
    currentThickness = 9; // Set the thickness to thick
    selectedTool = "thick";
    thickButton.classList.add("selectedTool"); // Apply selected style
    thinButton.classList.remove("selectedTool"); // Remove thin button's style
  }
};
buttonContainer.appendChild(thickButton);

app.appendChild(buttonContainer);
