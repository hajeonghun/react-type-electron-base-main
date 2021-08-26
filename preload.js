const {contextBridge, ipcRenderer} = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  console.log('##preload##');
});

contextBridge.exposeInMainWorld('appRuntime', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  subscribe: (channel, listener) => {
    const subscription = (event, ...args) => {
      console.log('args:', typeof args);
      return listener(event, ...args);
    };

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
});
