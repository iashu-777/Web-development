const { createServer } = require("http");
const { Server } = require("socket.io");
const PORT=3000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["*"]
  }  
});

io.on("connection", (socket) => {
  
  // ... 
});

httpServer.listen(PORT,function(){
    console.log("Your server is running at port "+PORT);
});