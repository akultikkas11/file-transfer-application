import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Button from '../components/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

let socket;
let file_type;

const Receiver = () => {
  
    const [progress, setProgress] = useState(0);    //To display the process of receivedBytes in UI.
    // const [receivedChunks, setReceivedChunks] = useState([]);   //As we are receiving the file chunk by chunk, we need to store the received chunks in right order chunk by chunk, so we used it as an empty array.
    
    const [downloadURL, setDownloadURL] = useState(false);


    // let receivedChunks = null;
    // let receivedBytes = 0;      //To track the progress.

    const receivedChunks = useRef(null);
    const receivedBytes = useRef(0);

    //-----------------------------------------------------------------------------------
    const [roomID, setRoomID] = useState("");    //To dispaly the roomID on the screen.
    const [errorMsg, setErrorMsg] = useState("");   //If invalid room id is typed.
    //-----------------------------------------------------------------------------------
    const [joinedRoom, setJoinedRoom] = useState(false);

    const [receivingFile, setReceivingFile] = useState(false);
    const [fileName, setFileName] = useState("received_file");

    useEffect(()=>{
        socket = io("http://localhost:5000");
    }, []);

    useEffect(()=>{
        const handleDataChunk = (data)=>{
            const {chunkData, chunkIdx, fileSize, totalChunks, fileType, fileName} = data;
            file_type = fileType;
            if(chunkIdx==0) {
                setReceivingFile(true);
                setFileName(fileName);
            }

            const uint8chunk_data = new Uint8Array(chunkData);    //We convert the plain array back to typed-array for calculation purposed, bcoz we had converted it to plain array in Sender.jsx just to transfer the chunkData via Socket.IO...

            if(chunkIdx==0) {
                receivedChunks.current = Array(totalChunks).fill(null);
                receivedBytes.current = 0;
                setDownloadURL(false);  //The download link will be hidden on new file transfer...
            }
            
            if (!receivedChunks.current[chunkIdx]) {
                receivedChunks.current[chunkIdx] = uint8chunk_data;
                receivedBytes.current += uint8chunk_data.length;
                setProgress(Math.floor((receivedBytes.current / fileSize) * 100));
            }
        }

        const handleFileTransferComplete = ()=>{
            const blob = new Blob(receivedChunks.current, {type: file_type});
            const url = URL.createObjectURL(blob);  // ✅ creates actual download URL
            setDownloadURL(url);
        }

        const handleInvalidRoomID = (data)=> {
            setErrorMsg(data.msg);
        }


        socket.on("receive_file_chunk", handleDataChunk);
        socket.on("file_end", handleFileTransferComplete);
        socket.on("error_msg", handleInvalidRoomID);
        socket.on("both_connected", ()=>{
            setJoinedRoom(true);
        })
    }, []);

    const joinRoom = ()=>{
        socket.emit("receiver_join", roomID);
    }

    return (
        <div className='min-h-screen flex justify-center'>
            {/* Container */}
            <div className='w-full max-w-2xl shadow-2xl flex justify-center'>

                {/* {!joinedRoom && ( 
                    <div className='flex flex-col'> */}
                <div className='flex flex-col'>
                    <div className="text-5xl md:text-6xl font-bold mt-6 mb-4 bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent">Receive Files</div>
                    
                    {!joinedRoom && ( 
                        <div className='flex flex-col'>
                            <div>
                                <p className='text-lg font-medium text-gray-700 text-center'>Enter Sender's Room ID:</p>
                            </div>
                            

                            <div className='flex flex-col items-center gap-y-8'>

                                <input type="text" className='border rounded-sm p-2 font-mono w-fit text-2xl text-center' onChange={(event)=>{setRoomID(event.target.value)}}/>
                                
                                <Button
                                classname='w-fit' 
                                onClick={joinRoom}
                                >
                                    Join Room
                                </Button>

                                {/* <button 
                                className='p-2 border rounded-lg h-fit'
                                onClick={joinRoom}
                                >
                                    Receive Files
                                </button> */}
                            </div>
                        </div>
                    )}
                

                    {joinedRoom && (
                        <>
                            <div className='flex w-[90%] gap-x-4 items-center justify-between mb-6'>

                                {receivingFile ? (
                                    <>
                                        <p>{`Progress `}</p>

                                        <progress 
                                        min={0}
                                        max={100}
                                        value={(progress)}
                                        className="w-[50%] h-4 rounded-full overflow-hidden bg-gray-200 accent-blue-500 transition-all" 
                                        ></progress>
                                            

                                        <span className='whitespace-nowrap'>{progress} %</span>
                                    </>
                                ) : (
                                    <p>No file is yet being received</p>
                                )}
                            </div>
                            {
                                downloadURL && (
                                    <div className='flex justify-center'>
                                        <a 
                                        href={downloadURL}
                                        download={fileName}
                                        className='flex gap-x-2 items-center px-4 py-2 rounded-full bg-[rgb(48,48,48)] hover:bg-gray-600 active:bg-gray-800'
                                        >   
                                            <span className='text-white'>Download File</span>
                                            <FileDownloadIcon className='text-white'/>
                                        </a>
                                    </div>
                                )
                            }
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Receiver