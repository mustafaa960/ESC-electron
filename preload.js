// Preload Script
const { contextBridge } = require('electron');

// this should print out the value of MY_ENVIRONMENT_VARIABLE
console.log(process.env.PORT);

contextBridge.exposeInMainWorld('envVars', {
  port: process.env.PORT
});