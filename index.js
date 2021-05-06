const express = require("express");
const app = express();
const socket = require("socket.io");
const cors = require("cors");
const path = require("path");

// app setup
const port = process.env.PORT || 8080;
app.get('/test', (req, res) =>
{
  res.send("newest")
})
console.log(path.join(__dirname, "../rafaflix/build"));
app.use(express.static(path.join(__dirname, "../rafachess/build")));
const server = app.listen(port, () =>
  console.log(`listening to request on port ${port}`)
);
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../rafachess/build", "index.html"));
});

app.use(cors())

// socket setup
const io = socket(server, {
    cors: {
    origin: "http://3.141.23.100",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let numClients = 0;

let gameRoom = 0

io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);
  numClients++
  console.log(numClients)
  if (numClients > 2)
  {
    numClients = 1;
    gameRoom++
  }
  socket.join(gameRoom)
  io.emit('stats', { numClients, gameRoom}) 
  socket.on("move", (data) => {
    // io.emit("move", data);

    socket.to(data.gameRoom).emit("move", data)
  });
});
