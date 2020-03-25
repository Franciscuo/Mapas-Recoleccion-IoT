const socketIO = require('socket.io');

const socket = {};// los objetos se guardan como referencia, la varaiable se actualiza

const connect = (server) => {
  socket.io = socketIO(server);
  socket.io.on('connection', (socketClient) => {
    console.log('Nuevo');
    socketClient.emit('connected', 'bienvenido');
  });
};
module.exports = {
  connect,
  socket,
};
