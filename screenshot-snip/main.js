const { app, BrowserWindow, Menu, Tray, globalShortcut } = require('electron');
const path = require('path')
let win;
let tray;

function createWindow() {
    win = new BrowserWindow({
        // titleBarStyle: 'hidden', // macOS系统
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    win.hide()
    win.loadURL(`http://localhost:3000`)

    win.on('closed', () => {
        win = null
    })
}

function createTray() {
    const iconPath = path.join(__dirname, 'assets/carrot.png')
    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show',
            type: 'normal',
            accelerator: 'CommandOrControl+Shift+Q',
            click() {
                win.show()
            }
        },
        {
            label: 'Quit',
            type: 'normal',
            click() {
                app.quit()
            }
        }
    ])
    tray.setToolTip('Snipping Tool')
    tray.setContextMenu(contextMenu)
}


app.on('ready', () => {
    createWindow()
    createTray()
    globalShortcut.register('CommandOrControl+Shift+Q', () => {
        if(win) {
            win.show()
        }
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});