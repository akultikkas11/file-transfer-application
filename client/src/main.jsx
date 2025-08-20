// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import { RouterProvider, createBrowserRouter } from 'react-router-dom';
// import App from './App.jsx'

// import Home from './components/Home.jsx';
// import Sender from './components/Sender.jsx';
// import Receiver from './components/Receiver.jsx';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     children: [
//       {
//         path: "",
//         element: <Home />
//       },

//       {
//         path: "sender",
//         element: <Sender />
//       },

//       {
//         path: "receiver",
//         element: <Receiver />
//       }
//     ],
//   },
// ]);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     {/* <App /> */}
//     <RouterProvider router={router} />
//   </StrictMode>,
// )

  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import { createBrowserRouter, RouterProvider } from 'react-router-dom';
  import './index.css'
  import App from './App.jsx'
  import Sender from './pages/Sender.jsx';
  import Receiver from './pages/Receiver.jsx';
  import Home from './pages/Home.jsx';

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "",
          element: <Home />
        },

        {
          path: "sender",
          element: <Sender />
        },

        {
          path: "receiver",
          element: <Receiver />
        },
      ]
    }
  ])

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
