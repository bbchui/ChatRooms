const Chat = require('./chat')

function ChatUI(socket) {
  this.chat = new Chat(socket);
  this.room = document.querySelector('#room')
  this.form = document.querySelector('form')
  this.msgList = document.querySelector('#msg-list')
  this.roomList = document.querySelector('#room-list')
  this.input = document.querySelector('input')
}

ChatUI.prototype.getInput = function() {
  return this.input.value
}

ChatUI.prototype.sendMsg = function(room) {
  this.chat.sendMessage(room, this.getInput())
}

ChatUI.prototype.addMsg = function(msg) {
  const newMsg = document.createElement('li')
  newMsg.textContent = msg
  this.msgList.appendChild(newMsg)
}

module.exports = ChatUI
