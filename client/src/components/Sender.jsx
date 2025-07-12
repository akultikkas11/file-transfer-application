import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import '../App.css';

// const socket = io('http://localhost:5000');
const socket = io('https://file-transfer-joez.onrender.com');

function generateID() {
  return `${Math.trunc(Math.random() * 999)} - ${Math.trunc(Math.random() * 999)} - ${Math.trunc(Math.random() * 999)}`;
}

const Sender = () => {
  const [joinID, setJoinID] = useState('');
  const [receiverID, setReceiverID] = useState('');
  const [showFS, setShowFS] = useState(false);

  const fileInputRef = useRef(null);
  const filesListRef = useRef(null);

  useEffect(() => {
    socket.on('init', (uid) => {
      setReceiverID(uid);
      setShowFS(true);
    });

    return () => {
      socket.off('init');
    };
  }, []);

  const handleCreateRoom = () => {
    const newID = generateID();
    setJoinID(newID);
    socket.emit('sender-join', { uid: newID });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result);
      const el = document.createElement('div');
      el.classList.add('item');
      el.innerHTML = `
        <div class="progress">0%</div>
        <div class="filename">${file.name}</div>
      `;
      filesListRef.current.appendChild(el);
      shareFile(
        {
          filename: file.name,
          total_buffer_size: buffer.length,
          buffer_size: 1024,
        },
        buffer,
        el.querySelector('.progress')
      );
    };
    reader.readAsArrayBuffer(file);
  };

  const shareFile = (metadata, buffer, progressNode) => {
    socket.emit('file-meta', { uid: receiverID, metadata });
    socket.on('fs-share', () => {
      const chunk = buffer.slice(0, metadata.buffer_size);
      buffer = buffer.slice(metadata.buffer_size);
      const percent = Math.trunc(
        ((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size) * 100
      );
      progressNode.innerText = `${percent}%`;
      if (chunk.length !== 0) {
        socket.emit('file-raw', { uid: receiverID, buffer: chunk });
      }
    });
  };

  return (
    <div className='flex flex-col'>

      <div className={`screen ${!showFS ? 'active' : ''}`}>

        <div className="join-screen">

          <h2 className='text-4xl font-extrabold text-gray-800 px-4 w-[90%]'>Share your files securely</h2>
          
          <div className='px-4'>
            <button 
            onClick={handleCreateRoom}
            className='cursor-pointer border px-4 py-2 text-white hover:bg-gray-800 bg-black rounded-full outline-none mt-4 mb-8'
            >
              Create Room
            </button>
          </div>

          {joinID && (
            <div className='ml-2 px-4 flex items-center gap-x-4'>
              <div>
                <span className='text-xl'>Room ID:</span>
              </div>
              <span className='border border-black p-4 font-mono text-2xl'>{joinID}</span>
            </div>
          )}
        </div>
      </div>

      <div className={`screen ${showFS ? 'active' : ''}`}>
        <div className="fs-screen">
          <label>
            <div className='border-[2px] border-dashed border-gray-400 text-center p-8 mb-2'>
              <p>Click here to select files for sharing</p>
            </div>
          
            <input type="file" ref={fileInputRef} onChange={handleFileChange} />
          
          </label>

          <div className="files-list overflow-y-auto max-h-[90vh] px-4" ref={filesListRef}>
            <div className="title">Shared files:</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sender;