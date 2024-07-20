const { app, BrowserWindow } = require("electron");

let appWindow;

function createWidow() {
  appWindow = new BrowserWindow({width: 1280, height: 720});
  appWindow.loadFile("dist/my-task-panel/index.html");
  appWindow.on("closed", () => { appWindow = null});
}

app.whenReady().then(() => {createWidow()})
