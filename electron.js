// public/electron.ts
const {app, BrowserWindow, ipcMain} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

// Gabage Collection이 일어나지 않도록 함수 밖에 선언함.
let mainWindow = BrowserWindow;

const newWindow = {};

function createWindow() {
  mainWindow = new BrowserWindow({
    // alwaysOnTop: true,
    center: true,
    // fullscreen: true,
    resizable: true,
    webPreferences: {
      // 보안상의 이유로 버전5부터 기본값 flase.
      // 활성화 시, 렌더러 프로세스에서 NODE API 접근가능하기 때문에
      // 보안에 취약하다.
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, './preload.js'),
    },
  });

  // 3. and load the index.html of the app.
  if (isDev) {
    // 개발 중에는 개발 도구에서 호스팅하는 주소에서 로드
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // 프로덕션 환경에서는 패키지 내부 리소스에 접근
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = undefined;
    // TODO:
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('asyncMessage', (event, arg) => {
  console.log(arg); // 'async ping'
  event.sender.send('asyncReply', 'async pong');
});

ipcMain.on('toMain', (event, path) => {
  console.log(path); // Cpp
  newWindow[path].webContents.send('toData', [1, 2, 3, 4]);
});

ipcMain.on('newWindow', (e, data) => {
  console.log('param:', data.url.split('#/')[1]);
  console.log('data:', data);
  console.log('newWindow:', newWindow);
  const param = data.url.split('#/')[1]; // Cpp
  for (const window in newWindow) {
    if (window === param) return;
  }

  newWindow[param] = new BrowserWindow({
    width: data.width ? data.width : 500,
    height: data.height ? data.height : 470,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, './preload.js'),
    },
    resizable: 'resizable' in data ? data.resizable : true,
    show: false,
  });

  if (isDev) {
    // 개발 중에는 개발 도구에서 호스팅하는 주소에서 로드
    newWindow[param].webContents.openDevTools();
  }

  // FIXME - 쿠키 및 세션 값 설정 로직이 추가되면 됨.

  newWindow[param].on('closed', () => delete newWindow[param]);
  newWindow[param].loadURL(data.url);
  newWindow[param].show();
});
