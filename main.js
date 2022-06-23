// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path');
const ProgressBar = require('electron-progressbar');

autoUpdater.autoDownload = false;

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

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

// =================================================
// ==================== updater ====================
// =================================================

autoUpdater.checkForUpdates();

  let progressBar;
  
/* 업데이트가 가능한지 확인하는 부분이다.
업데이트가 가능한 경우 팝업이 뜨면서 업데이트를 하겠냐고 묻는다.
Update를 클릭하면 업데이트 가능한 파일을 다운로드 받는다. */
  autoUpdater.on('update-available', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update available',
        message:
          'A new version of Project is available. Do you want to update now?',
        buttons: ['Update', 'Later'],
      })
      .then((result) => {
        const buttonIndex = result.response;

        if (buttonIndex === 0) autoUpdater.downloadUpdate();
      });
  });

/* progress bar가 없으면 업데이트를 다운받는 동안 사용자가 그 내용을 알 수 없기 때문에
progress bar는 꼭 만들어준다. */
  autoUpdater.once('download-progress', (progressObj) => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Updating...',
        message: 'Now updating',
        buttons: ['Restart', 'Later'],
      });
    // progressBar = new ProgressBar({
    //   text: 'Downloading...',
    //   detail: 'Downloading...',
    // });

    // progressBar
    //   .on('completed', function () {
    //     console.info(`completed...`);
    //     progressBar.detail = 'Task completed. Exiting...';
    //   })
    //   .on('aborted', function () {
    //     console.info(`aborted...`);
    //   });
  });

  // 업데이트를 다운받고 나면 업데이트 설치 후 재시작을 요청하는 팝업이 뜬다.
  autoUpdater.on('update-downloaded', () => {
    // progressBar.setCompleted();
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update ready',
        message: 'Install & restart now?',
        buttons: ['Restart', 'Later'],
      })
      .then((result) => {
        const buttonIndex = result.response;

        if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true);
      });
  });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
