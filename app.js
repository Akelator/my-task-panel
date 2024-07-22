const { app, BrowserWindow, shell } = require("electron");

let appWindow;

function createWidow() {
  appWindow = new BrowserWindow({width: 1280, height: 720, });
  appWindow.setMenuBarVisibility(false);
  appWindow.loadFile("dist/my-task-panel/index.html");
  appWindow.webContents.setWindowOpenHandler(({ url }) => shell.openExternal(url));
  appWindow.on("closed", () => { appWindow = null});
}

app.whenReady().then(() => {createWidow()})
