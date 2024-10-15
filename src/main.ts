import "./style.css";

const APP_NAME = "Sketch";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;

//Create h1 element and set app name
const titleElement = document.createElement("h1");
titleElement.textContent = APP_NAME;

app.appendChild(titleElement);


//Create canvas element
const canvasElement  = document.createElement("canvas");
canvasElement.width = 256;
canvasElement.height = 256;




// Append the canvas element to the app container
app.appendChild(canvasElement);