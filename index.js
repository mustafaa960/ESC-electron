const { app, BrowserWindow } = require('electron');
const electron = require('electron');
const child_process = require('child_process');
const path = require('path');
const dialog = electron.dialog;
// const http = require('http');
// const server = require('./src/app')
// const listen =require('./src/app').listen;

// To Close:
// console.log(server);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}


var mainWindow;
// var runExpress;
const createWindow = () => {
// mainWindow=new BrowserWindow({})
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: { devTools: false, nodeIntegration: true },
    width: 1400,
    height: 850,
    minWidth: 1000,
    minHeight: 670,
    autoHideMenuBar: true,
    icon: path.join(__dirname,'./src/build/logo.ico')
    
    // preload: path.join(__dirname, 'preload.js')

  });


  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname,'./src/build/index.html'));
  // mainWindow.loadFile(require('./src/app'));
  // console.log("port!!!!!!!!!!"+process.env.port);
  // console.log("port!!!!!!!!!!"+mainWindow.envVars.port);
  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL('http://localhost:3001')
  // mainWindow.addListener(listen)
  // mainWindow.webContents.send('mainprocess-response', require('./src/app'));
  // mainWindow.loadFile(ser)

  // Open the DevTools.
  
  mainWindow.on('close', (e) => {
    // if (mainWindow.forceClose) return;
    // e.preventDefault();
    // run_script(`for /f "tokens=5" %a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do taskkill /f /pid %a`)
  });
  // mainWindow.on('closed', () => {
  //   runExpress.kill();
  // });

};



app.enableSandbox();
app.on('ready', (e) => {


  Promise.all([

    run_script(`netstat -nao | find /i ":3001" | find "LISTENING" /c`, null, (data) => {
      data.on('data', (data) => {
        // console.log(parseInt(data));
        if (parseInt(data) > 0) {
          run_script(`for /f "tokens=5" %a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do taskkill /f /pid %a`)
        }

      });
    }),
    // run_script('npm run serverStart')
    run_script("cd "+path.join(__dirname,'./src')+" && npm start")
    // run_script("cd "+path.join(path.join(__dirname,'./').replace('app.asar', 'app.asar.unpacked'),'/src')+" && npm start"),
  //  console.log(path.join(path.join(__dirname,'./').replace('app.asar', 'app.asar.unpacked'),'/src')+" && npm start")
  ]
  ).finally(res => {
    // console.log(res);
    createWindow()
  })
    // 
    // ])
    .then(res => {
      // console.log(path.join(__dirname,'./app.asar/src'));
      // createWindow()
    })
    .catch(e => {
      console.log('error run server ' + e);
    })


});

function run_script(command, args, callback) {
  var child = child_process.spawn(command, args, {
    encoding: 'utf8',
    shell: true
  });
  // You can also use a variable to save the output for when the script closes later
  child.on('error', (error) => {
    dialog.showMessageBox({
      title: 'Title',
      type: 'warning',
      message: 'Error occured.\r\n' + error
    });
  });

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (data) => {

    //Here is the output
    // data = data.toString();
    // mainWindow.webContents.send('mainprocess-response', data);
    console.log(data);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (data) => {
    // Return some data to the renderer process with the mainprocess-response ID
    // mainWindow.webContents.send('mainprocess-response', data);
    //Here is the output from the command

    console.log(data);
  });

  child.on('close', (code) => {
    //Here you can get the exit code of the script  
    switch (code) {
      case 0:
        // return data
        // dialog.showMessageBox({
        //   title: 'Title',
        //   type: 'info',
        //   message: 'End process.\r\n'
        // });
        break;
    }

  });
  if (typeof callback === 'function')
    callback(child.stdout.on('data', (data) => { return { data: data } }))
}

app.on("before-quit", (event) => {
  event.preventDefault();
  Promise.all([run_script(`for /f "tokens=5" %a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do taskkill /f /pid %a`)]).then(
    setTimeout(() => {
      process.exit();
    }, 3000)
  )
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', (e) => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


