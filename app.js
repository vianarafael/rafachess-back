const express = require("express");
const app = express();
const socket = require("socket.io");
const cors = require("cors");

// app setup
const port = 3001;
app.get("/", (req, res) => {
  res.send("<h1>Test</h1>");
});
const server = app.listen(port, () =>
  console.log(`listening to request on port ${port}`)
);

app.use(cors());

// socket setup
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let numClients = 1;

let gameRoom = Math.random();

io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);
  numClients++;

  if (numClients > 2) {
    numClients = 1;
    gameRoom = Math.random();
  }

  socket.join(gameRoom);
  io.emit("stats", { numClients, gameRoom });

  socket.on("move", (data) => {
    if (data.gameRoom) io.to(data.gameRoom).emit("move", data);
  });
});
