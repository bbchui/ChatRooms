document.addEventListener('DOMContentLoaded', () => {
  const io = require('socket.io-client');
  const chatUI = require('./chatUI')


  window.chat = new chatUI(io)

})
