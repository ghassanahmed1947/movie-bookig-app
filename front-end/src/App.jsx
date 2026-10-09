import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import BookingForm from "./pages/BookingForm";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:id" element={<BookingForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/my-bookings" element={<MyBookings />} />

      {/* Koi galat URL likhe to Home par bhej do */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;