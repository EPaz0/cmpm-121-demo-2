import "./style.css";

const APP_NAME = "Sketch";
const app = document.querySelector<HTMLDivElement>("#app")!;

// Set the title of the document
document.title = APP_NAME;

// Create h1 element and set app name
const titleElement = document.createElement("h1");
titleElement.textContent = APP_NAME;
app.appendChild(titleElement);


// StickerPreview
class StickerPreview {
  x: number;
  y: number;
  sticker: string;

  constructor(x: number, y: number, sticker: string) {
    this.x = x;
    this.y = y;
    this.sticker = sticker;
  }

  update(x: number, y: number, sticker: string) {
    this.x = x;
    this.y = y;
    this.sticker = sticker;
  }

  // Draw the sticker preview on canvas
  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = "30px Arial";
    ctx.fillText(this.sticker, this.x, this.y);
  }
}

// Array to store stickers
const stickers: { x: number; y: number; sticker: string }[] = [];
let stickerPreview: StickerPreview | null = null;
let selectedSticker: string | null = null;

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
      ctx.lineWidth = this.thickness;
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

function createCustomSticker() {
  const customSticker = prompt("Enter your custom sticker text:", "❓");
  if (customSticker) {
    stickersList.push(customSticker); // Add to the stickers array
    renderStickerButtons(); // Re-render the buttons to include the new sticker
  }
}

// ToolPreview class to show the preview of the tool
class ToolPreview {
  x: number;
  y: number;
  thickness: number;

  constructor(x: number, y: number, thickness: number) {
    this.x = x;
    this.y = y;
    this.thickness = thickness;
  }

  // Update the preview position
  update(x: number, y: number, thickness: number) {
    this.x = x;
    this.y = y;
    this.thickness = thickness;
  }

  // Draw the preview on the canvas
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.thickness / 2, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// Array to store all lines
const lines: Line[] = [];
const redoLines: Line[] = [];
let currentLine: Line | null = null;
let toolPreview: ToolPreview | null = new ToolPreview(0, 0, 3);

// Default marker thickness
let currentThickness: number = 3;
let selectedTool: string | null = null;

// Create canvas element
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
app.appendChild(canvas);

// Get the 2d context of the canvas
const context = canvas.getContext("2d")!;
if (!context) {
  throw new Error("2d context not supported");
}

const cursor = { active: false, x: 0, y: 0 };

// Function to handle sticker selection and updates
function selectSticker(sticker: string) {
  selectedSticker = sticker;
  stickerPreview = new StickerPreview(cursor.x, cursor.y, sticker);
  currentLine = null;
  redraw();
}

// Redraw all lines and tool preview on the canvas
function redraw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    line.display(context);
  }

  for (const sticker of stickers) {
    context.font = "30px Arial";
    context.fillText(sticker.sticker, sticker.x, sticker.y);
  }

  if (toolPreview) {
    toolPreview.draw(context);
  }

  if (stickerPreview) {
    stickerPreview.draw(context);
  }
}

// Start drawing
canvas.addEventListener("mousedown", (event) => {
  cursor.active = true;
  cursor.x = event.offsetX;
  cursor.y = event.offsetY;

  if (selectedSticker) {
    stickers.push({ x: cursor.x, y: cursor.y, sticker: selectedSticker });
    stickerPreview = null;
    selectedSticker = null;
  } else {
    currentLine = new Line(cursor.x, cursor.y, currentThickness);
    lines.push(currentLine);
    redoLines.length = 0;
  }

  redraw();
});

canvas.addEventListener("mousemove", (event) => {
  cursor.x = event.offsetX;
  cursor.y = event.offsetY;

  if (toolPreview) {
    toolPreview.update(cursor.x, cursor.y, currentThickness);
  }

  if (stickerPreview) {
    stickerPreview.update(cursor.x, cursor.y, selectedSticker || "");
  }

  if (cursor.active && currentLine) {
    currentLine.drag(cursor.x, cursor.y);
  }

  redraw();
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
  cursor.active = false;
  currentLine = null;
});

// Control buttons container
const buttonContainer = document.createElement("div");
buttonContainer.classList.add("control-button-container");

// Sticker buttons container
const stickerButtonContainer = document.createElement("div");
stickerButtonContainer.classList.add("sticker-container");

// Sticker section container (for the stickers and the create custom sticker button)
const stickerSection = document.createElement("div");
stickerSection.classList.add("sticker-section");

// Stickers list
const stickersList = ["🐵", "🙉", "🦧"];

// Custom sticker button
const customStickerButton = document.createElement("button");
customStickerButton.textContent = "Create Custom Sticker";
customStickerButton.onclick = createCustomSticker;
customStickerButton.classList.add("custom-sticker-button");
stickerSection.appendChild(customStickerButton);

function renderStickerButtons() {
  stickerButtonContainer.innerHTML = "";
  stickersList.forEach((sticker) => {
    const button = document.createElement("button");
    button.textContent = sticker;
    button.onclick = () => selectSticker(sticker);
    stickerButtonContainer.appendChild(button);
  });
  stickerSection.appendChild(stickerButtonContainer);
}
app.appendChild(stickerSection);

// Add control buttons
function createButton(label: string, action: () => void, id?: string) {
  const button = document.createElement("button");
  button.textContent = label;
  button.onclick = action;

  if (id) {
    button.id = id;
  }

  return button;
}

function updateToolButtonStyles(selectedButton: HTMLButtonElement | null) {
  document.querySelectorAll("button").forEach((button) => {
    button.classList.remove("selectedTool");
  });

  if (selectedButton) {
    selectedButton.classList.add("selectedTool");
  }
}

buttonContainer.appendChild(createButton("Clear", () => {
  lines.length = 0;
  stickers.length = 0;
  redoLines.length = 0;
  redraw();
}));

buttonContainer.appendChild(createButton("Undo", () => {
  if (lines.length > 0) {
    redoLines.push(lines.pop()!);
    redraw();
  }
}));

buttonContainer.appendChild(createButton("Redo", () => {
  if (redoLines.length > 0) {
    lines.push(redoLines.pop()!);
    redraw();
  }
}));

buttonContainer.appendChild(createButton("Thin Marker", () => {
  if (selectedTool === "thin") {
    selectedTool = null;
    currentThickness = 3;
    updateToolButtonStyles(null);
  } else {
    selectedTool = "thin";
    currentThickness = 1;
    const thinButton = document.getElementById("thinButton") as HTMLButtonElement;
    updateToolButtonStyles(thinButton);
  }
}, "thinButton"));

buttonContainer.appendChild(createButton("Thick Marker", () => {
  if (selectedTool === "thick") {
    selectedTool = null;
    currentThickness = 3;
    updateToolButtonStyles(null);
  } else {
    selectedTool = "thick";
    currentThickness = 9;
    const thickButton = document.getElementById("thickButton") as HTMLButtonElement;
    updateToolButtonStyles(thickButton);
  }
}, "thickButton"));

// Export button
buttonContainer.appendChild(createButton("Export", () => {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = 1024;
  exportCanvas.height = 1024;
  
  const exportContext = exportCanvas.getContext("2d")!;
  exportContext.scale(4, 4);
  
  lines.forEach((line) => {
    line.display(exportContext);
  });

  stickers.forEach((sticker) => {
    exportContext.font = "30px Arial";
    exportContext.fillText(sticker.sticker, sticker.x, sticker.y);
  });

  const anchor = document.createElement("a");
  anchor.href = exportCanvas.toDataURL("image/png");
  anchor.download = "sketchpad.png";
  anchor.click();
}));

// Add the button container and sticker section to the app
app.appendChild(buttonContainer);
app.appendChild(stickerSection);

// Render the sticker buttons
renderStickerButtons();

