const express = require("express");
const app = express();
const socket = require("socket.io");
const cors = require("cors");

// app setup
const port = process.env.PORT || 1234;
app.get('/test', (req, res) =>
{
  res.send("Test")
})
const server = app.listen(port, () =>
  console.log(`listening to request on port ${port}`)
);


app.use(cors())

// socket setup
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let numClients = 0;

io.on("connection", (socket) => {
  console.log("made socket connection");
  numClients++
  console.log(numClients)
  if (numClients > 2) numClients = 1
  io.emit('stats', numClients)
  socket.on("move", (data) => {
    io.emit("move", data);
  });
});
