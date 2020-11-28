const { Menu, shell, app, BrowserWindow, globalShortcut, dialog } = require('electron');
const { ipcMain } = require('electron')
const fs = require('fs')

app.on('ready', () => {
    globalShortcut.register('CommandOrControl+S', () => {
        console.log('Saving the file');
        const window = BrowserWindow.getFocusedWindow();
        window.webContents.send('editor-event', 'save');
    })
    globalShortcut.register('CommandOrControl+O', () => {
        const window = BrowserWindow.getFocusedWindow();
        const options = {
            title: 'Pick a markdown file',
            filters: [
                { name: 'Markdown files', extensions: ['md'] },
                { name: 'Text files', extensions: ['txt'] }
            ]
        }
        dialog.showOpenDialog(window, options).then(result => {
            let paths = result.filePaths
            if (paths.length > 0) {
                const content = fs.readFileSync(paths[0]).toString();
                window.webContents.send('load', content)
            }
        })
    })
})

ipcMain.on('save', (event, arg) => {
    console.log(`Saving content of the file`)
    console.log(arg)

    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Save markdown file',
        filters: [
            {
                name: 'MyFile',
                extensions: ['md']
            }
        ]
    }
    dialog.showSaveDialog(window, options).then(result => {
        if (result.filePath) {
            console.log(`Saving content to the file: ${result.filePath}`)
            fs.writeFileSync(result.filePath, arg)
        }
    })
})

ipcMain.on('editor-reply', (event, arg) => {
    console.log(`Received reply from web page: ${arg}`);
});

const template = [
    {
        role: 'help',
        submenu: [
            {
                label: 'About Editor Component',
                click() {
                    shell.openExternal('https://simplemde.com/')
                }
            }
        ]
    },
    {
        label: 'Format',
        submenu: [
            {
                label: 'Toggle Bold',
                click() {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('editor-event', 'toggle-bold')
                }
            }
        ]
    }
];

if (process.env.DEBUG) {
    template.push(
        {
            label: 'Debugging',
            submenu: [
                {
                    label: 'Dev Tools',
                    role: 'toggleDevTools'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'reload',
                    accelerator: 'Ctrl+R'
                }
            ]
        }
    )
}

template.unshift({
    label: app.getName(),
    submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' }
    ]
})

const menu = Menu.buildFromTemplate(template);

module.exports = menu;