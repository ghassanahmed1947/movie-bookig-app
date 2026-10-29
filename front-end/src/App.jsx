import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import BookingForm from "./pages/BookingForm";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import MyBookings from "./pages/MyBookings";
import Locations from "./pages/Location";

function App() {
  const { pathname } = useLocation();

  // Naye page par jao to upar se shuru ho
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:id" element={<BookingForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/locations" element={<Locations />} />

      {/* Koi galat URL likhe to Home par bhej do */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
