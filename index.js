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
// app.use(express.static("public"));

// socket setup
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("made socket connection");
  socket.on("move", (data) => {
    io.emit("move", data);
  });
});
