import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Footer, Header, PageNotFound } from './components';
import { Home, StoreDetails, About, Solutions, Places, Contact, PodDetails, BookingHistory, AuthPage } from './pages';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <main className=''>
            <Header />
            <Routes>
              <Route path={'/'} element={<Home />} />
              <Route path={'/store/:id'} element={<StoreDetails />} />
              <Route path={'/pod/:id'} element={<PodDetails />} />
              <Route path={'/about'} element={<About />} />
              <Route path={'/solutions'} element={<Solutions />} />
              <Route path={'/places'} element={<Places />} />
              <Route path={'/contact'} element={<Contact />} />
              <Route 
                path={'/booking-history'} 
                element={
                  <ProtectedRoute>
                    <BookingHistory />
                  </ProtectedRoute>
                } 
              />
              <Route path="/auth" element={<AuthPage />} />
              <Route path={'*'} element={<PageNotFound />} />
            </Routes>
            <Footer />
          </main>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
