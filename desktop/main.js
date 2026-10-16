const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

let backendProcess = null;
let mainWindow = null;

// Carpeta de datos del usuario (persiste entre actualizaciones de la app)
const carpetaDatos = path.join(app.getPath('userData'), 'database');
const rutaBaseDatos = path.join(carpetaDatos, 'inventario.db');
const rutaBackups = path.join(carpetaDatos, 'backups');

function asegurarBaseDatos() {

  if (!fs.existsSync(carpetaDatos)) {
    fs.mkdirSync(carpetaDatos, { recursive: true });
  }

  // Si es la primera vez que se abre la app, copia la base de datos vacía
  if (!fs.existsSync(rutaBaseDatos)) {
   const dbVacia = app.isPackaged
  ? path.join(process.resourcesPath, 'inventario_vacio.db')
  : path.join(__dirname, 'resources', 'inventario_vacio.db');
    fs.copyFileSync(dbVacia, rutaBaseDatos);
    console.log('Base de datos inicial creada en:', rutaBaseDatos);
  }
}

function iniciarBackend() {

  const rutaJar = app.isPackaged
    ? path.join(process.resourcesPath, 'backend.jar')
    : path.join(__dirname, 'resources', 'backend.jar');

  const rutaJava = app.isPackaged
    ? path.join(process.resourcesPath, 'jre', 'bin', 'java.exe')
    : path.join(__dirname, 'resources', 'jre', 'bin', 'java.exe');

  backendProcess = spawn(rutaJava, [
    '-jar', rutaJar,
    `--app.database.path=${rutaBaseDatos}`,
    `--app.backup.path=${rutaBackups}`,
    `--spring.datasource.url=jdbc:sqlite:${rutaBaseDatos}`
  ]);

  backendProcess.stdout.on('data', (data) => console.log(`[Backend]: ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`[Backend ERROR]: ${data}`));
}

function esperarBackend(callback) {

  const intentar = () => {
    http.get('http://localhost:8080/auth/necesita-setup', (res) => {
      callback();
    }).on('error', () => {
      setTimeout(intentar, 1000); // reintenta cada segundo
    });
  };

  intentar();
}

function crearVentana() {

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'frontend-dist', 'index.html'));
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  return {
    action: 'allow',
    overrideBrowserWindowOptions: {
      width: 400,
      height: 700,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    }
  };
});

  mainWindow.once('ready-to-show', () => {

    mainWindow.show();

    // Truco para Windows: forzar que el sistema operativo reconozca la ventana como activa
    mainWindow.setAlwaysOnTop(true);
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(false);

    // Refuerzo adicional: asegura el foco del contenido web con un pequeño delay
    setTimeout(() => {
      mainWindow.webContents.focus();
    }, 100);

  });

}

app.whenReady().then(() => {

  asegurarBaseDatos();
  iniciarBackend();

  esperarBackend(() => {
    crearVentana();
  });

});

app.on('window-all-closed', () => {

  if (backendProcess) {
    backendProcess.kill();
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});