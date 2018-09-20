'use strict';
const electron = require('electron');
//const log = require('./src/util/logger')
//const controller = require('./src/ProcessController')
import {ProcessController} from './src/ProcessController'
import { BrowserWindow } from 'electron';
const log = require('./src/util/logger')
console.log(log)

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
//require('electron-debug')();

// prevent window being garbage collected
let mainWindow :BrowserWindow;

export let processController

function onClosed() {
	console.log('closing window')
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {

	console.log('creating window')

	let winHeight = 600
	let winWidth = 400
	const win = new electron.BrowserWindow({
		width: winWidth,
		height: winHeight,
		frame: false,
		title: 'AbstractSpace',
		transparent: true
	});
	let display = electron.screen.getPrimaryDisplay().bounds
	console.log(display.height)
	win.setPosition(display.width-winWidth,
				    display.height-winHeight)
	//win.loadURL('file:///home/reagan/code/proj/abstract-space/AbstractSpace/index.html')
	//win.loadURL(`C:\\Users\\rmacc\\code\\proj\\AbstractSpace\\index.html`)
	win.loadURL(`file://${__dirname}/../index.html`);
	console.log(`file://${__dirname}/../index.html`)
	win.on('closed', onClosed);
	//win.hide()
	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	console.log('activate')
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	console.log('ready')
	mainWindow = createMainWindow();
    mainWindow.hide()
    mainWindow.setAlwaysOnTop(true)
	console.log('creating process controller')
	processController = new ProcessController(mainWindow)
});
