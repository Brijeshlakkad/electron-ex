const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const dialog = electron.dialog

const path = require('path')
const url = require('url')

let win;

function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600, show: false });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    win.webContents.openDevTools();
    win.on('ready-to-show', () => {
        win.show();
    })
    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('active', () => {
    if (win == null) {
        createWindow();
    }
})

ipc.on('file-create',function(event){
    dialog.showMessageBox({title: "Success",message: 'File Created!'})
    event.sender.send("file-created", 'The file created')
})

ipc.on('file-delete',function(event){
    let options  = {
        buttons: ["Yes","No","Cancel"],
        message: "Do you really want to quit?"
    }
    dialog.showMessageBox(options, (response) => {
        event.returnValue = response
    })
})