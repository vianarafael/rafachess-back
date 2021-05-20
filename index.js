const express = require("express");
const app = express();
const socket = require("socket.io");
const cors = require("cors");

// app setup
const port = process.env.PORT || 1234;
app.get("/test", (req, res) => {
  res.send("Test");
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

let numClients = 0;

let gameRoom = 0;

io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);
  numClients++;
  console.log(numClients);

  if (numClients > 2) {
    numClients = 1;
    gameRoom++;
  }
  socket.join(gameRoom);
  io.emit("stats", { numClients, gameRoom });

  socket.on("move", (data) => {
    console.log(data);
    socket.to(data.gameRoom).emit("move", data);
  });
});
