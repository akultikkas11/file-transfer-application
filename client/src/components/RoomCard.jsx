import React from 'react';

const RoomCodeCard = ({ roomCode }) => {
  return (
    <div className="bg-[#414347] text-white p-6 rounded-xl shadow-lg max-w-sm w-[80%] text-center mx-auto border border-gray-700">
      <h2 className="text-lg font-semibold mb-3">Your Room Code</h2>
      <p className="text-3xl md:text-4xl font-bold text-cyan-400 tracking-wider mb-2">{roomCode}</p>
      <p className="text-sm text-gray-400">Share this code with others to let them join your room</p>
    </div>
  );
};

export default RoomCodeCard;

//bg-[#111827]