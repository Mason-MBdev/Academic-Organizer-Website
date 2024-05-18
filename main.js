const { app, BrowserWindow, Menu, MenuItem } = require('electron');
const path = require('path');
const { screen } = require('electron'); // Import the screen module

// Function to create a new browser window
function createWindow () {
  // Get the size of the primary display
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Create a simple menu
  const menuTemplate = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggledevtools' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: function () {
            // Show an about dialog
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Emitted when the window gains focus.
  mainWindow.on('focus', () => {
    // Perform actions when the window gains focus.
  });

  // Quit when all windows are closed, except on macOS. There, it's common for applications
  // and their menu bar to stay active until the user quits explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform!== 'darwin') {
      app.quit();
    }
  });

  // When app is ready...
  app.on('ready', () => {
    createWindow();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common for applications
// and their menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on('will-quit', () => {
  // Perform clean up tasks
});
