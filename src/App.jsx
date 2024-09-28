import { BrowserRouter, Route, Routes, } from 'react-router-dom';
import { Footer, Header, PageNotFound, FetchData, Room } from './components';
import { Home, RoomDetails } from './pages';
import { useEffect } from 'react';


const App = () => {

  
  // const paths = [
  //   { path: '/', element: <Home /> },
  //   { path: '/room/:id', element: <RoomDetails /> },
  //   { path: '*', element: <PageNotFound /> },
  // ]

  // const router = createBrowserRouter(paths);
  // <RouterProvider router={router} /> 

  return (
    <main className=''>
      <BrowserRouter>

        <Header />

        <Routes>
          <Route path={'/'} element={<Home />} />
          <Route path={'/room/:id'} element={<RoomDetails />} />
          <Route path={'*'} element={<PageNotFound />} />
        </Routes>
        <FetchData></FetchData>
      

        <Footer />

      </BrowserRouter>
    </main>
  )
}

export default App