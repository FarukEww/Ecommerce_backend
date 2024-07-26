import express, { Request, Response } from "express";
import connectDB from "./server/config/db";
import user_route from "./server/routes/userRoutes";
import cors from "cors";
import bodyParser from "body-parser";
import chat_route from "./server/routes/chatRoutes";
import message_route from "./server/routes/messageRoute";
import { Server as SocketIOServer } from "socket.io";

const app = express();
app.use(express.json());
app.use(cors());

// app.use(express.bodyParser())
const port = process.env.PORT;
connectDB();
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to chat app");
});
app.use("/api", user_route);
app.use("/api", chat_route);
app.use("/api", message_route);
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const allowedOrigins = ["http://192.168.1.17:3000"];
const io: SocketIOServer = new SocketIOServer(server, {
  pingTimeout: 6000,
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // const userID = socket.request
  // console.log(userID,"socje");

  console.log("connected to socket.io", socket.id);
  socket.on("setup", (userData) => {
    console.log(userData._id, "userID");

    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log("User Joined Room : " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"))
  socket.on("stopTyping",(room)=> socket.in(room).emit("stopTyping"))
  socket.on("newMessage", (newMessageReceived) => {
    //without database
    console.log(newMessageReceived.data, "hd");

    //with database use
    const chat = newMessageReceived.data.chat;

    chat.users.forEach((user: any) => {
      console.log(user, "USERR");
      console.log(newMessageReceived.data, "NEW MESSAGE");
      if (user._id === newMessageReceived.data.sender._id) return;

  
    console.log(user._id,"user id");
   socket.to(user._id).emit("messageReceived", newMessageReceived.data);
    //   // Send the message to the user and mark them as having received it
    // socket
    //   .to(newMessageReceived.receiver_id)
    //   .emit("messageReceived", newMessageReceived); //without database
    });
  });

  // socket.on("newMessage", (newMessageReceived) => {
  //   // console.log(newMessageReceived.data.chat, "nmeddb");

  //   const chat = newMessageReceived.data.chat;
  //   // console.log(chat, "chat");

  //   if (!chat.users) {
  //     console.log("chat.users not defined");
  //   }

  //   // chat.users.forEach((user:any) => {
  //   //   console.log(user, "hello");

  //   //   // Skip emitting to the sender
  //   //   if (user._id === newMessageReceived.data.sender._id) {
  //   //     return;
  //   //   }

  //   //   // Get the user's socket from the connectedUsers Map

  //   //   // Emit the message to the user
  //   //   if (userSocket) {
  //   //     userSocket.emit("messageReceived", newMessageReceived.data);
  //   //   }
  //   // });

  //   chat.users.forEach((user: any) => {
  //     // console.log(user, "hello");

  //     if (user._id === newMessageReceived.data.sender._id) return;
  //     // console.log(newMessageReceived.data,"donee");

  //   socket.to(user._id).emit("messageReceived", newMessageReceived.data);
  //   });
  // });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
