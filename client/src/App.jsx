// import './index.css';
// import { Outlet } from 'react-router-dom';

// const App = () => {
//   return (
//     <div className='flex justify-center mt-2 min-h-screen'>
//       <div className='w-full max-w-2xl h-[auto] border flex flex-col gap-y-[4rem] items-center shadow-lg'>
        
//         <h1 className='text-3xl p-4 font-bold'>File Share App</h1>
        
//         <>
//           <Outlet />
//         </>
      
//       </div>
//     </div>
//   );
// };

// export default App;

import { Outlet } from 'react-router-dom'

function App() {

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default App
