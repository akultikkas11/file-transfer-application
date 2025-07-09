import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import download from 'downloadjs';
import '../App.css';

const socket = io('http://localhost:5000');

function generateID() {
  return `${Math.trunc(Math.random() * 999)} - ${Math.trunc(Math.random() * 999)} - ${Math.trunc(Math.random() * 999)}`;
}

const Receiver = () => {
  const [senderID, setSenderID] = useState('');
  const [connected, setConnected] = useState(false);
  const filesListRef = useRef(null);
  const fileShare = useRef({});

  useEffect(() => {
    socket.on('fs-meta', (metadata) => {
      fileShare.current = {
        metadata,
        transmitted: 0,
        buffer: [],
        progress_node: null,
      };

      const el = document.createElement('div');
      el.classList.add('item');
      el.innerHTML = `
        <div class="progress">0%</div>
        <div class="filename">${metadata.filename}</div>
      `;

      filesListRef.current.appendChild(el);
      fileShare.current.progress_node = el.querySelector('.progress');

      socket.emit('fs-start', { uid: senderID });
    });

    socket.on('fs-share', (buffer) => {
      const share = fileShare.current;
      share.buffer.push(buffer);
      share.transmitted += buffer.byteLength;
      share.progress_node.innerText =
        Math.trunc((share.transmitted / share.metadata.total_buffer_size) * 100) + "%";

      if (share.transmitted === share.metadata.total_buffer_size) {
        // download(new Blob(share.buffer), share.metadata.filename);
        const blob = new Blob(share.buffer);
        const url = URL.createObjectURL(blob);

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download';
        downloadBtn.className = 'ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition';
        
        downloadBtn.onclick = () => {
          download(blob, share.metadata.filename);
          URL.revokeObjectURL(url); // Clean up blob URL
        };

        // Append the download button to the file item
        share.progress_node.parentElement.appendChild(downloadBtn);


        fileShare.current = {};
      } else {
        socket.emit('fs-start', { uid: senderID });
      }
    });

    return () => {
      socket.off('fs-meta');
      socket.off('fs-share');
    };
  }, [senderID]);

  const connectToSender = () => {
    const joinID = generateID();
    socket.emit('receiver-join', {
      uid: joinID,
      sender_uid: senderID,
    });
    setConnected(true);
  };

  return (
    <div>

      <div className={`screen ${!connected ? 'active' : ''}`}>
        
        <div className="join-screen flex flex-col gap-y-2 items-center w-full">

          <div>
            <h2 className='text-2xl font-extrabold text-gray-800 px-4'>Enter Sender's Room ID</h2>
          </div>

          <div className='flex flex-col justify-center items-center gap-y-6'>
            <div>
              <input 
              value={senderID} 
              onChange={(e) => setSenderID(e.target.value)}
              className='p-2 border rounded-md shadow-md outline-none font-mono text-2xl max-w-[14rem]'
              />
            </div>
          
            <div>
              <button 
              onClick={connectToSender}
              className='cursor-pointer border px-4 py-2 text-white hover:bg-gray-800 bg-black rounded-full outline-none'
              >Connect</button>
            </div>

          </div>

        </div>
      </div>

      <div className={`screen ${connected ? 'active' : ''}`}>
        <div className="fs-screen overflow-y-auto max-h-[90vh] px-4">
          <div className="files-list flex flex-wrap" ref={filesListRef}>
            <div className="title">Shared files:</div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Receiver;
