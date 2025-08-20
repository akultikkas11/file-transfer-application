import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';
import Button from '../components/Button';
import RoomCodeCard from '../components/RoomCard';

let socket;

const Sender = () => {

    // const [bytesTransferred, setBytesTransferred] = useState(0);    //To track how many bytes are transferred  WHY NOT STATE ???
    let bytesTransferred = 0;
    const [progress, setProgress] = useState(0);    //To update the progress bytes-wise, not chunk-wise
    const fileInputRef = useRef(null);

    const [roomID, setRoomID] = useState("");


    const [receiverJoined, setReceiverJoined] = useState(false);
    const [waitMsg, setWaitMsg] = useState("");

    const [disable, setDisable] = useState(true); //'Activate Room' button will only be active if a roomID has been generated...

    const [showProgressBar, setShowProgressBar] = useState(false);
    const [disabled, setDisabled] = useState(true);     //For the button one....

    useEffect(()=>{
        //Connects to the server.
        // socket = io("http://localhost:5000");
        socket = io('https://file-transfer-joez.onrender.com');

        //Sender changes the UI once the room is created.
        socket.on('room_created', ()=>{
            setWaitMsg("Waiting for the receiver to join...");
        });

        //When the receiver also gets connected.
        socket.on("both_connected", ()=>{
            setReceiverJoined(true);
            setWaitMsg(false);
        })
    }, []);

    const handleSubmit = ()=>{
        setShowProgressBar(true);
        setDisabled(true);
        
        const file = fileInputRef.current.files[0];
        
        const chunk_size = 64 * 1024; //64kb
        const total_chunks =  Math.ceil(file.size/chunk_size);
        let current_chunk = 0;

        const reader = new FileReader();

        reader.onload = ()=>{
            const chunk_data = new Uint8Array(reader.result);

            socket.emit("send_file_chunk", {
                fileName: file.name, 
                fileType: file.type,    //This will be useful for 'MIME' for BLOB at receiver's side for downloading purposes...
                fileSize: file.size,    //Will be used in Receiver.jsx
                totalChunks: total_chunks, //Will be used in Receiver.jsx
                chunkIdx: current_chunk,
                chunkData: Array.from(chunk_data),  //Convert typed-array to normal array, as it is JSON serializable and can be tranasferred via Socket.IO as typed-array is non JSON-serializable, so it cannot be sent over Socket.IO
            });

            // socket.emit("send_file_chunk", {
            //     chunkIdx: current_chunk,
            //     chunkData: Array.from(chunk_data),  //Convert typed-array to normal array, as it is JSON serializable and can be tranasferred via Socket.IO as typed-array is non JSON-serializable, so it cannot be sent over Socket.IO
            // });
            
            

            current_chunk += 1;
            bytesTransferred = bytesTransferred+chunk_data.length
            // setBytesTransferred(bytesTransferred+chunk_data.length);

            setProgress(Math.floor((bytesTransferred/file.size) * 100));

            if(current_chunk < total_chunks) {
                readNextChunk();
            }
            else {
                socket.emit("file_end");
                setDisabled(false);
            }
        };
        const readNextChunk = ()=>{
            const start = current_chunk * chunk_size;
            const end = Math.min(start+chunk_size, file.size);
            const blob = file.slice(start, end);
            reader.readAsArrayBuffer(blob);
        }
    
        readNextChunk();
    }

    const generateNumber = ()=>{
        return Math.floor(Math.random()*900) + 100; 
    }
    
    const generateID = ()=>{
        return `${generateNumber()}-${generateNumber()}-${generateNumber()}`;
    }

    const handleCreateRoom = ()=>{
        setDisable(false);
        setRoomID(generateID());
    }

    const registerRoom = ()=>{
        socket.emit('register_room', roomID);
    }

  return (
    <div className='min-h-screen flex justify-center'>
        <div className='w-full max-w-2xl shadow-2xl flex flex-col items-center'>
            <div className='flex flex-col items-center'>
                <span className="text-5xl md:text-6xl font-bold mt-6 mb-4 bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent">Send Files</span>

                <span className='text-lg text-center font-medium text-gray-700 mb-6'>Create a room to start sharing files with others</span>
            </div>

            {(!waitMsg && !receiverJoined) && (
                <>
                    {   
                        roomID && 
                        <RoomCodeCard roomCode={roomID} />
                        // <input type="text" value={roomID} disabled/>
                    }

                    <div className='flex flex-col items-center gap-y-6'>
                        <Button 
                        onClick={handleCreateRoom}
                        classname='mt-6 w-fit'
                        >Create Room</Button>

                        <Button
                        onClick={registerRoom}
                        classname='w-fit'
                        disabled={disable}
                        >Activate Room</Button>

                        {/* <button
                        onClick={handleCreateRoom}
                        >Create Room</button>

                        <button
                        onClick={registerRoom}
                        >Activate Room</button> */}

                    </div>
                </>
            )}
            <br />

            {waitMsg && (
                <div className="flex flex-col gap-y-4 mt-6 px-4 py-3 rounded-lg text-gray-700 text-center w-[80%] max-w-md shadow-sm">
                    <p className='font-sans text-lg font-medium'>RoomID: {roomID}</p>
                    <p className="text-2xl font-medium font-sans">{waitMsg}</p>
                </div>
            )}

            {receiverJoined && (
                <>
                    <input type="file" 
                    // className='border rounded-sm p-2'
                    className="block w-[80%] h-auto text-sm text-gray-900 bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6" 
                    ref={fileInputRef}
                    onChange={()=>{
                        const file = fileInputRef.current.files[0];
                        setDisabled(!file);
                    }}
                    />

                    {/* <button
                    className='p-2 rounded-lg active:bg-gray-300 border hover:cursor-pointer hover:bg-gray-200'
                    onClick={handleSubmit}
                    >Send the file</button> */}

                    {showProgressBar && (
                        <div className='flex w-[90%] gap-x-4 items-center justify-center mb-6'>

                            <p>{`Progress `}</p>

                            <progress 
                            min={0}
                            max={100}
                            value={progress}
                            className="w-[50%] h-4 rounded-full overflow-hidden bg-gray-200 accent-blue-500 transition-all" 
                            ></progress>
                                

                            <span>{progress} %</span>
                            
                        </div>
                    )}
                    <Button onClick={handleSubmit} disabled={disabled}>
                        Send file
                    </Button>

                </>
            )}
        </div>
    </div>
  )
}

export default Sender