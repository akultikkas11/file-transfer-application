import express  from 'express';
import http  from 'http';
import { Server } from 'socket.io';
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // origin: "http://localhost:5173",
        origin: ["https://file-transfer-client-ten.vercel.app"],
        method: ["GET", "POST"],
    }
});
app.use(cors());

let pendingRooms = {} //roomID -> senderSocketID

io.on('connection', (socket)=>{
    // console.log(`A user connected...${socket.id}`);

    socket.on("send_file_chunk", (data)=>{
        socket.broadcast.emit("receive_file_chunk", data);
    });

    socket.on("file_end", ()=>{
        // console.log("Transfer Complete");
        socket.broadcast.emit("file_end");
    })

    //Register the room which is created by the sender.
    socket.on("register_room", (roomID)=>{
        pendingRooms[roomID] = socket.id;
        socket.join(roomID);    //Sender joins the room.
        socket.roomID = roomID;

        //Notify the sender that room has been created.
        socket.emit("room_created");
    });

    //Receiver joins.
    socket.on("receiver_join", (roomID)=>{
        const senderID = pendingRooms[roomID];

        if(senderID) {
            socket.join(roomID);    //Receiver Joins the room.
            socket.roomID = roomID;

            //Notify both the senders that they are ready.
            io.to(roomID).emit("both_connected", {roomID});
        }
        else {
            socket.emit("error_msg", {
                msg: "Invalid Room id",
            })
            console.log("Error...INVALID ROOM ID...")
        }
    });
})

server.listen(5000, ()=>{
    console.log("Server running at http://localhost:5000");
});