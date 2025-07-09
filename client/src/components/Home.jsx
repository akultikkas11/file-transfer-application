import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='flex flex-col'>
      <div >
        <h2 className='text-4xl font-extrabold text-gray-800 px-4 w-[90%]'>Share your files securely</h2>
      </div>
        
      <div>
        <p className='text-xl mt-4 px-4'>Select a role to continue:</p>
      </div>

      <div className='flex justify-around mt-4'>
          <Link to="/sender">
              <button
              className='cursor-pointer border px-4 py-2 text-white hover:bg-gray-800 bg-black rounded-full outline-none'
              >
                Send Files
              </button>
          </Link>
    
          <Link to="/receiver">
              <button
              className='cursor-pointer border px-4 py-2 text-white hover:bg-gray-800 bg-black rounded-full outline-none'
              >
                Receive Files
              </button>
          </Link>
      </div>
    </div>
  );
}

export default Home