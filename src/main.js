const {app, BrowserWindow, powerSaveBlocker , Notification, dialog} = require('electron')
const path = require('path')
 
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: "build/logo.png"
  })
 
  // and load the index.html of the app.
  mainWindow.loadURL('https://meet.google.com/bff-rrje-pku');
  // mainWindow.webContents.openDevTools()
  app.setBadgeCount(10);
    mainWindow.on('close', e => {
      e.preventDefault()
      dialog.showMessageBox({
        type: 'info',
        buttons: ['No', 'Yes'],
        cancelId: 1,
        defaultId: 0,
        title: 'Warning',
        detail: 'Are you sure you want to exit?',
        icon:"public/logo.png",
      }).then(({ response }) => {
        if (response) {
          mainWindow.destroy()
          app.quit()
        }
      })
    });
    powerSaveBlocker.start('prevent-display-sleep');
    mainWindow.webContents.on('new-window', function(e, url) {
      e.preventDefault();
      require('electron').shell.openExternal(url);
    });
    Notification.on('click', (event, arg)=>{
      mainWindow.moveTop()
      mainWindow.focus()
  })
 
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}
 
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
 
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
 
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
 
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
