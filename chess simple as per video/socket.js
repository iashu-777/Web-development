const { createServer } = require("http");
const { Server } = require("socket.io");
const PORT = 3000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["*"]
  }
});

let totalPlayers = 0;
let players = {};
let waiting = {
  '10': [],
  '15': [],
  '20': [],
};
let matches = {
  '10': [],
  '15': [],
  '20': [],
};

function removeSocketFromWaitingPeriod(socket) {
  const foreachLoop = [10, 15, 20];
  foreachLoop.forEach(element => {
    const index = waiting[element].indexOf(socket);
    if (index > -1) {
    waiting[element].splice(index, 1);
    }
  });
}

function fireTotalPlayers() {
  io.emit('total_players_count_change', totalPlayers);
}
function FireonDisConnect(socket) {
  removeSocketFromWaitingPeriod(socket.id);
  totalPlayers--;
  fireTotalPlayers();
}

function HandlePlayRequest(socket, time) {

  if(waiting[time].length>0){
    return;
  }

  if (!waiting[time].includes(socket.id)) {
    waiting[time].push(socket.id);
  }
}

function FireOnConnected(socket) {
  socket.on('want_to_play', function (timer) {
    
    HandlePlayRequest(socket, timer);
    console.log(waiting);
  });
  totalPlayers++;
  fireTotalPlayers();
}

io.on("connection", (socket) => {
  players[socket.id] = socket
  FireOnConnected(socket);
  socket.on('disconnect', () => FireonDisConnect(socket));
  // ... 
});

httpServer.listen(PORT, function () {
  console.log("Your server is running at port " + PORT);
});