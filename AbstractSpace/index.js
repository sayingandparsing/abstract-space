'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require('electron');
//const log = require('./src/util/logger')
//const controller = require('./src/ProcessController')
var ProcessController_1 = require("./src/ProcessController");
var log = require('./src/util/logger');
console.log(log);
var app = electron.app;
// adds debug features like hotkeys for triggering dev tools and reload
//require('electron-debug')();
// prevent window being garbage collected
var mainWindow;
var processController;
function onClosed() {
    console.log('closing window');
    // dereference the window
    // for multiple windows store them in an array
    mainWindow = null;
}
function createMainWindow() {
    console.log('creating window');
    var winHeight = 600;
    var winWidth = 400;
    var win = new electron.BrowserWindow({
        width: winWidth,
        height: winHeight,
        frame: true,
        title: 'AbstractSpace',
        transparent: true
    });
    var display = electron.screen.getPrimaryDisplay().bounds;
    console.log(display.height);
    win.setPosition(display.width - winWidth, display.height - winHeight);
    //win.loadURL('file:///home/reagan/code/proj/abstract-space/AbstractSpace/index.html')
    //win.loadURL(`C:\\Users\\rmacc\\code\\proj\\AbstractSpace\\index.html`)
    win.loadURL("file://" + __dirname + "/index.html");
    console.log("file://" + __dirname + "/index.html");
    win.on('closed', onClosed);
    //win.hide()
    return win;
}
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    console.log('activate');
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});
app.on('ready', function () {
    console.log('ready');
    mainWindow = createMainWindow();
    //mainWindow.hide()
    console.log('creating process controller');
    processController = new ProcessController_1.ProcessController(mainWindow);
});
//# sourceMappingURL=index.js.map