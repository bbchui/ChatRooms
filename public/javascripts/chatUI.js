const Chat = require('./chat')

function ChatUI(socket) {
  this.chat = new Chat(socket);
  this.room = document.querySelector('#room')
  this.form = document.querySelector('form')
  this.msgList = document.querySelector('#msg-list')
  this.roomList = document.querySelector('#room-list')
  this.input = document.querySelector('input')
  this.users = document.querySelector('#users')
  this.submitHandler();
}

ChatUI.prototype.getInput = function() {
  return this.input.value
}

ChatUI.prototype.setRoom = function (room) {
  this.room.textContent = room
}

ChatUI.prototype.sendMsg = function(room) {
  this.chat.sendMessage(room, this.getInput())
}

ChatUI.prototype.addMsg = function(msg, name) {
  const newMsg = document.createElement('li')
  newMsg.textContent = msg
  this.msgList.appendChild(newMsg)
  this.msgList.scrollTop += this.msgList.scrollHeight;
}

ChatUI.prototype.addRoom = function (room) {
  const newRoom = document.createElement('li')
  newRoom.textContent = room
  this.roomList.appendChild(newRoom)
}

ChatUI.prototype.addUser = function (user) {
  const newUser = document.createElement('li')
  newUser.textContent = user
  this.users.appendChild(newUser)
}

ChatUI.prototype.submitHandler = function () {
  this.form.addEventListener('submit', (e) => {
    e.preventDefault()
    this.processUserInput()
    this.input.value = ''
  })
}

ChatUI.prototype.processUserInput = function () {
  const msg = this.getInput()
  let response
  if (msg[0] === '/') {
    response = this.chat.processCommand(msg)
    if (response) {
      this.addMsg(response)
    }
  } else {
    this.sendMsg(this.room.textContent)
    this.addMsg(msg)
  }
}

module.exports = ChatUI
