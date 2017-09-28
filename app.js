const express = require('express');
const app = express();
const http = require('http').Server(app)
const chatServer = require('./lib/chatServer')
chatServer.listen(http);

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
  // console.log("Hello World");
})


http.listen(8000, () => {
  console.log(`listening on 8000`)
})
