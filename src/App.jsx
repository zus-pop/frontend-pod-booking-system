import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
    Home,
    StoreDetails,
    About,
    Solutions,
    Places,
    PodDetails,
    BookingHistory,
    BookingDetails,
    Policy,
} from "./pages";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
    return (
        <Router>
            <ToastProvider>
                <AuthProvider>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/store/:id" element={<StoreDetails />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/solutions" element={<Solutions />} />
                        <Route path="/places" element={<Places />} />
                        <Route path="/pod/:id" element={<PodDetails />} />
                        <Route path="/booking-history" element={<BookingHistory />} />
                        <Route path="/booking-history/:id" element={<BookingDetails />} />
                        <Route path="/policy" element={<Policy />} />
                    </Routes>
                    <Footer />
                </AuthProvider>
            </ToastProvider>
        </Router>
    );
}

export default App;
