import React from 'react'
import {Link} from 'react-router-dom'
import Button from '../components/Button'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';

const Home = () => {
  return (
    <div className="min-h-screen flex justify-center">  
      <div className='w-full max-w-2xl shadow-2xl flex flex-col items-center gap-y-5'>
          <div>
            <img src="/file_transfer2.avif" alt="file_transfer" className='w-auto h-60'/>
          </div>

          <div>
            <h1 className='text-3xl font-bold'>File Sharing App</h1>
          </div>

          <div className='w-[50%] text-center'>
            <p className='text-lg font-medium text-gray-700 '>Send and receive files instantly. No accounts, no limits, just pure speed.</p>
          </div>

          <div className='w-full flex flex-col items-center gap-y-4 md:flex-row md:justify-center md:gap-x-4'>
            <Link to="/sender">
              <Button classname='flex items-center gap-x-1'>
                <FileUploadIcon />
                Send Files
              </Button>
            </Link>

            <Link to="/receiver">
              <Button classname='flex items-center gap-x-2'>
                <DownloadIcon />
                Receive Files
              </Button>
            </Link>
          </div>
      </div>
    </div>
  )
}

export default Home