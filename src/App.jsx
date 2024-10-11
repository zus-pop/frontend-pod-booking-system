import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer, Header, PageNotFound } from './components';
import { Home, StoreDetails, About, Solutions, Places, Contact } from './pages';

const App = () => {
  return (
    <main className=''>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path={'/'} element={<Home />} />
          <Route path={'/store/:id'} element={<StoreDetails />} />
          <Route path={'/about'} element={<About />} />
          <Route path={'/solutions'} element={<Solutions />} />
          <Route path={'/places'} element={<Places />} />
          <Route path={'/contact'} element={<Contact />} />
          <Route path={'*'} element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  )
}

export default App