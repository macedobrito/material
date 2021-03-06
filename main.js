const {app, BrowserWindow}= require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow(){
  win = new BrowserWindow({width:1016, height:600, frame: false, transparent: true, icon:__dirname+'/img/logo.png'})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  //Open devtools
  win.webContents.openDevTools();

  win.on('closed', ()=> {
    win = null;
  })
}

app.on('ready', createWindow)


app.on('window-all-closed', () => {
  if(process.platform !== 'darwin'){
    app.quit();
  }
})
