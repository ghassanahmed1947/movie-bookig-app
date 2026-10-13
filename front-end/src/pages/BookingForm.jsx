// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   User,
//   Phone,
//   Users,
//   Clock,
//   Clapperboard,
//   ArrowLeft,
//   CheckCircle2,
//   Ticket,
//   MapPin,
//   Film,
//   Navigation,
// } from "lucide-react";
// import api from "../api";
// import { formatShowDate, formatShowTime, getUpcomingShows } from "../utils/shows";

// function BookingForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   const [movie, setMovie] = useState(null);
//   const [locations, setLocations] = useState([]);
//   const [locLoaded, setLocLoaded] = useState(false);
//   const [form, setForm] = useState({
//     showDate: "",
//     showTime: "",
//     city: "",
//     locationId: "",
//     customerName: user.name || "",
//     contactNo: "",
//     seats: 1,
//   });
//   const [message, setMessage] = useState("");
//   const [loadError, setLoadError] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const availableShows = getUpcomingShows(movie?.shows || []);
//   const availableDates = [...new Set(availableShows.map((show) => show.date))];
//   const dateShows = availableShows.filter((show) => show.date === form.showDate);

//   useEffect(() => {
//     // Login ke baghair booking nahi ho sakti
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     api
//       .get(`/movies/${id}`)
//       .then((res) => {
//         setMovie(res.data);
//         const shows = getUpcomingShows(res.data.shows || []);
//         setForm((f) => ({
//           ...f,
//           showDate: shows[0]?.date || "",
//           showTime: shows[0]?.time || "",
//         }));
//       })
//       .catch(() => setLoadError("Movie not found."));

//     api
//       .get("/locations")
//       .then((res) => setLocations(res.data))
//       .catch(() => setLocations([]))
//       .finally(() => setLocLoaded(true));
//   }, [id]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Shehar badalne par cinema reset ho jata hai
//   const handleCityChange = (e) => {
//     setForm({ ...form, city: e.target.value, locationId: "" });
//   };

//   const cities = [...new Set(locations.map((l) => l.city))].sort();
//   const cityCinemas = locations.filter((l) => l.city === form.city);
//   const selectedCinema = locations.find((l) => l._id === form.locationId);
//   const noCinemas = locLoaded && locations.length === 0;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setSaving(true);

//     try {
//       await api.post("/bookings", {
//         movie: id,
//         location: form.locationId,
//         showDate: form.showDate,
//         showTime: form.showTime,
//         customerName: form.customerName,
//         contactNo: form.contactNo,
//         seats: Number(form.seats),
//       });
//       setSuccess(true);
//     } catch (err) {
//       // Token expire ho gaya to dobara login karwao
//       if (err.response?.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         navigate("/login");
//         return;
//       }
//       setMessage(err.response?.data?.message || "Booking failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loadError) {
//     return (
//       <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-white gap-4">
//         <p className="text-gray-400">{loadError}</p>
//         <button
//           onClick={() => navigate("/")}
//           className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold text-sm transition"
//         >
//           Back to Movies
//         </button>
//       </div>
//     );
//   }

//   if (!movie) {
//     return (
//       <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">
//         <p className="text-gray-400">Loading movie details...</p>
//       </div>
//     );
//   }

//   const fieldBox =
//     "flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-3 focus-within:border-red-500/60 transition";
//   const labelClass =
//     "text-xs uppercase tracking-wide text-gray-500 mb-1.5 block";

//   return (
//     <div className="min-h-screen bg-[#070b14] text-white flex flex-col">
//       {/* NAVBAR */}
//       <nav className="sticky top-0 z-50 bg-[#080c16]/90 backdrop-blur-xl border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
//           <div
//             onClick={() => navigate("/")}
//             className="flex items-center gap-3 cursor-pointer"
//           >
//             <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/30">
//               <Clapperboard size={24} />
//             </div>
//             <h1 className="text-xl font-extrabold tracking-wide">
//               Cine<span className="text-red-500">Book</span>
//             </h1>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate("/my-bookings")}
//               className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
//             >
//               <Ticket size={16} className="text-red-400" />
//               <span className="hidden sm:inline">My Bookings</span>
//             </button>

//             <button
//               onClick={() => navigate("/")}
//               className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
//             >
//               <ArrowLeft size={16} />
//               <span className="hidden sm:inline">Back to Movies</span>
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* MAIN */}
//       <main className="flex-1 px-5 sm:px-8 py-12">
//         <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
//           {/* MOVIE CARD */}
//           <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl shadow-black/20 h-fit">
//             <div className="bg-slate-950 flex items-center justify-center p-2">
//               <img
//                 src={movie.posterUrl}
//                 alt={movie.title}
//                 className="w-full h-80 object-contain rounded-xl"
//               />
//             </div>

//             <div className="p-6">
//               <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
//                 {movie.category}
//               </span>

//               <h2 className="text-2xl font-bold mt-4">{movie.title}</h2>
//               <p className="text-sm text-gray-500 leading-relaxed mt-2">
//                 {movie.description}
//               </p>

//               <div className="mt-5">
//                 <p className="text-[11px] uppercase tracking-wider text-gray-600 mb-2">
//                   Available Showtimes
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   {availableShows.map((show) => (
//                     <span
//                       key={`${show.date}-${show.time}`}
//                       className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
//                     >
//                       {formatShowDate(show.date)} · {formatShowTime(show.time)}
//                     </span>
//                   ))}
//                   {availableShows.length === 0 && (
//                     <p className="text-sm text-gray-500">No upcoming shows are available.</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* FORM / SUCCESS */}
//           {success ? (
//             <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-fit">
//               <CheckCircle2 className="text-green-500 mb-4" size={52} />
//               <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
//               <p className="text-gray-400 text-sm">
//                 {form.seats} seat(s) for{" "}
//                 <span className="text-white font-medium">{movie.title}</span>
//               </p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Showtime: <span className="text-white">{form.showDate ? `${formatShowDate(form.showDate)}, ${formatShowTime(form.showTime)}` : "Unavailable"}</span>
//               </p>
//               {selectedCinema && (
//                 <p className="text-gray-400 text-sm mt-1 mb-7">
//                   Cinema:{" "}
//                   <span className="text-white">
//                     {selectedCinema.name}, {selectedCinema.city}
//                   </span>
//                 </p>
//               )}

//               <button
//                 onClick={() => navigate("/my-bookings")}
//                 className="w-full bg-red-600 hover:bg-red-500 transition py-3 rounded-xl font-semibold shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
//               >
//                 <Ticket size={18} />
//                 View My Bookings
//               </button>

//               <button
//                 onClick={() => navigate("/")}
//                 className="w-full mt-3 bg-white/5 hover:bg-white/10 border border-white/10 transition py-3 rounded-xl font-semibold"
//               >
//                 Book Another Movie
//               </button>
//             </div>
//           ) : (
//             <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-6 sm:p-8 h-fit">
//               <h3 className="text-xl font-semibold mb-6">Booking Details</h3>

//               {message && (
//                 <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-5">
//                   {message}
//                 </div>
//               )}

//               {noCinemas && (
//                 <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm p-3 rounded-lg mb-5">
//                   No cinemas have been added yet, so booking is not available
//                   right now. Please check back soon.
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* CITY */}
//                 <div>
//                   <label className={labelClass}>City</label>
//                   <div className={fieldBox}>
//                     <MapPin className="text-gray-500 mr-3" size={18} />
//                     <select
//                       name="city"
//                       value={form.city}
//                       onChange={handleCityChange}
//                       disabled={noCinemas}
//                       className="w-full bg-transparent outline-none text-sm disabled:opacity-50"
//                       required
//                     >
//                       <option value="" className="text-black">
//                         Select your city
//                       </option>
//                       {cities.map((c) => (
//                         <option key={c} value={c} className="text-black">
//                           {c}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* CINEMA */}
//                 <div>
//                   <label className={labelClass}>Cinema</label>
//                   <div className={fieldBox}>
//                     <Film className="text-gray-500 mr-3" size={18} />
//                     <select
//                       name="locationId"
//                       value={form.locationId}
//                       onChange={handleChange}
//                       disabled={!form.city}
//                       className="w-full bg-transparent outline-none text-sm disabled:opacity-50"
//                       required
//                     >
//                       <option value="" className="text-black">
//                         {form.city ? "Select a cinema" : "Select a city first"}
//                       </option>
//                       {cityCinemas.map((l) => (
//                         <option key={l._id} value={l._id} className="text-black">
//                           {l.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Chune hue cinema ki jaankari */}
//                   {selectedCinema && (
//                     <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-gray-400 space-y-2">
//                       <div className="flex items-start gap-2.5">
//                         <MapPin size={15} className="text-red-500 shrink-0 mt-0.5" />
//                         <span>{selectedCinema.address}</span>
//                       </div>
//                       {selectedCinema.phone && (
//                         <div className="flex items-center gap-2.5">
//                           <Phone size={15} className="text-red-500 shrink-0" />
//                           <span>{selectedCinema.phone}</span>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                   {selectedCinema?.mapUrl && (
//                         <a
//                           href={selectedCinema.mapUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center gap-2 text-red-400 hover:text-red-300"
//                         >
//                           <Navigation size={15} className="shrink-0" />
//                           View on Google Maps
//                         </a>
//                       )}
//                 </div>

//                 {/* SHOWTIME */}
//                 <div>
//                   <label className={labelClass}>Show date</label>
//                   <div className={fieldBox}>
//                     <Clock className="text-gray-500 mr-3" size={18} />
//                     <select
//                       name="showDate"
//                       value={form.showDate || ""}
//                       onChange={(e) => {
//                         const nextDate = e.target.value;
//                         const firstShow = availableShows.find((show) => show.date === nextDate);
//                         setForm((f) => ({ ...f, showDate: nextDate, showTime: firstShow?.time || "" }));
//                       }}
//                       className="w-full bg-transparent outline-none text-sm"
//                       required
//                     >
//                       <option value="" className="text-black">Select a date</option>
//                       {availableDates.map((date) => (
//                         <option key={date} value={date} className="text-black">
//                           {formatShowDate(date)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Showtime</label>
//                   <div className={fieldBox}>
//                     <Clock className="text-gray-500 mr-3" size={18} />
//                     <select
//                       name="showTime"
//                       value={form.showTime || ""}
//                       onChange={handleChange}
//                       className="w-full bg-transparent outline-none text-sm"
//                       required
//                     >
//                       <option value="" className="text-black">Select a time</option>
//                       {dateShows.map((show) => (
//                         <option key={show.time} value={show.time} className="text-black">
//                           {formatShowTime(show.time)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* NAME */}
//                 <div>
//                   <label className={labelClass}>Full Name</label>
//                   <div className={fieldBox}>
//                     <User className="text-gray-500 mr-3" size={18} />
//                     <input
//                       type="text"
//                       name="customerName"
//                       placeholder="Enter your name"
//                       value={form.customerName}
//                       onChange={handleChange}
//                       className="w-full bg-transparent outline-none text-sm placeholder-gray-600"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* CONTACT */}
//                 <div>
//                   <label className={labelClass}>Contact Number</label>
//                   <div className={fieldBox}>
//                     <Phone className="text-gray-500 mr-3" size={18} />
//                     <input
//                       type="tel"
//                       name="contactNo"
//                       placeholder="03XX-XXXXXXX"
//                       value={form.contactNo}
//                       onChange={handleChange}
//                       className="w-full bg-transparent outline-none text-sm placeholder-gray-600"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* SEATS */}
//                 <div>
//                   <label className={labelClass}>Number of Seats</label>
//                   <div className={fieldBox}>
//                     <Users className="text-gray-500 mr-3" size={18} />
//                     <input
//                       type="number"
//                       name="seats"
//                       min="1"
//                       value={form.seats}
//                       onChange={handleChange}
//                       className="w-full bg-transparent outline-none text-sm"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={saving || noCinemas || !locLoaded || availableShows.length === 0 || !form.showTime}
//                   className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition py-3.5 rounded-xl font-semibold shadow-lg shadow-red-900/20"
//                 >
//                   {saving ? "Booking..." : "Confirm Booking"}
//                 </button>
//               </form>
//             </div>
//           )}
//         </div>
//       </main>

//       <footer className="border-t border-white/10 bg-[#050811] py-6 text-center text-xs text-gray-600">
//         © {new Date().getFullYear()} CineBook. All rights reserved.
//       </footer>
//     </div>
//   );
// }

// export default BookingForm;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Users,
  Clock,
  Clapperboard,
  ArrowLeft,
  CheckCircle2,
  Ticket,
  MapPin,
  Film,
  Navigation,
} from "lucide-react";
import api from "../api";
import { formatShowDate, formatShowTime, getUpcomingShows } from "../utils/shows";

function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [movie, setMovie] = useState(null);
  const [locations, setLocations] = useState([]);
  const [locLoaded, setLocLoaded] = useState(false);
  const [form, setForm] = useState({
    showDate: "",
    showTime: "",
    city: "",
    locationId: "",
    customerName: user.name || "",
    contactNo: "",
    seats: 1,
  });
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const availableShows = getUpcomingShows(movie?.shows || []);
  const availableDates = [...new Set(availableShows.map((show) => show.date))];
  const dateShows = availableShows.filter((show) => show.date === form.showDate);

  useEffect(() => {
    // Login ke baghair booking nahi ho sakti
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get(`/movies/${id}`)
      .then((res) => {
        setMovie(res.data);
        const shows = getUpcomingShows(res.data.shows || []);
        setForm((f) => ({
          ...f,
          showDate: shows[0]?.date || "",
          showTime: shows[0]?.time || "",
        }));
      })
      .catch(() => setLoadError("Movie not found."));

    api
      .get("/locations")
      .then((res) => setLocations(res.data))
      .catch(() => setLocations([]))
      .finally(() => setLocLoaded(true));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Shehar badalne par cinema reset ho jata hai
  const handleCityChange = (e) => {
    setForm({ ...form, city: e.target.value, locationId: "" });
  };

  const cities = [...new Set(locations.map((l) => l.city))].sort();
  const cityCinemas = locations.filter((l) => l.city === form.city);
  const selectedCinema = locations.find((l) => l._id === form.locationId);
  const noCinemas = locLoaded && locations.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      await api.post("/bookings", {
        movie: id,
        location: form.locationId,
        showDate: form.showDate,
        showTime: form.showTime,
        customerName: form.customerName,
        contactNo: form.contactNo,
        seats: Number(form.seats),
      });
      setSuccess(true);
    } catch (err) {
      // Token expire ho gaya to dobara login karwao
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      setMessage(err.response?.data?.message || "Booking failed");
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-white gap-4">
        <p className="text-gray-400">{loadError}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-semibold text-sm transition"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">
        <p className="text-gray-400">Loading movie details...</p>
      </div>
    );
  }

  const fieldBox =
    "flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-3 focus-within:border-red-500/60 transition";
  const labelClass =
    "text-xs uppercase tracking-wide text-gray-500 mb-1.5 block";

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#080c16]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/30">
              <Clapperboard size={24} />
            </div>
            <h1 className="text-xl font-extrabold tracking-wide">
              Cine<span className="text-red-500">Book</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/my-bookings")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
            >
              <Ticket size={16} className="text-red-400" />
              <span className="hidden sm:inline">My Bookings</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Movies</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-1 px-5 sm:px-8 py-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* MOVIE CARD */}
          <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl shadow-black/20 h-fit">
            <div className="bg-slate-950 flex items-center justify-center p-2">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-80 object-contain rounded-xl"
              />
            </div>

            <div className="p-6">
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                {movie.category}
              </span>

              <h2 className="text-2xl font-bold mt-4">{movie.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                {movie.description}
              </p>
            </div>
          </div>

          {/* FORM / SUCCESS */}
          {success ? (
            <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-fit">
              <CheckCircle2 className="text-green-500 mb-4" size={52} />
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-gray-400 text-sm">
                {form.seats} seat(s) for{" "}
                <span className="text-white font-medium">{movie.title}</span>
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Showtime: <span className="text-white">{form.showDate ? `${formatShowDate(form.showDate)}, ${formatShowTime(form.showTime)}` : "Unavailable"}</span>
              </p>
              {selectedCinema && (
                <p className="text-gray-400 text-sm mt-1 mb-7">
                  Cinema:{" "}
                  <span className="text-white">
                    {selectedCinema.name}, {selectedCinema.city}
                  </span>
                </p>
              )}

              <button
                onClick={() => navigate("/my-bookings")}
                className="w-full bg-red-600 hover:bg-red-500 transition py-3 rounded-xl font-semibold shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
              >
                <Ticket size={18} />
                View My Bookings
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full mt-3 bg-white/5 hover:bg-white/10 border border-white/10 transition py-3 rounded-xl font-semibold"
              >
                Book Another Movie
              </button>
            </div>
          ) : (
            <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-6 sm:p-8 h-fit">
              <h3 className="text-xl font-semibold mb-6">Booking Details</h3>

              {message && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-5">
                  {message}
                </div>
              )}

              {noCinemas && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm p-3 rounded-lg mb-5">
                  No cinemas have been added yet, so booking is not available
                  right now. Please check back soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* CITY */}
                <div>
                  <label className={labelClass}>City</label>
                  <div className={fieldBox}>
                    <MapPin className="text-gray-500 mr-3" size={18} />
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleCityChange}
                      disabled={noCinemas}
                      className="w-full bg-transparent outline-none text-sm disabled:opacity-50"
                      required
                    >
                      <option value="" className="text-black">
                        Select your city
                      </option>
                      {cities.map((c) => (
                        <option key={c} value={c} className="text-black">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CINEMA */}
                <div>
                  <label className={labelClass}>Cinema</label>
                  <div className={fieldBox}>
                    <Film className="text-gray-500 mr-3" size={18} />
                    <select
                      name="locationId"
                      value={form.locationId}
                      onChange={handleChange}
                      disabled={!form.city}
                      className="w-full bg-transparent outline-none text-sm disabled:opacity-50"
                      required
                    >
                      <option value="" className="text-black">
                        {form.city ? "Select a cinema" : "Select a city first"}
                      </option>
                      {cityCinemas.map((l) => (
                        <option key={l._id} value={l._id} className="text-black">
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chune hue cinema ki jaankari */}
                  {selectedCinema && (
                    <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-gray-400 space-y-2">
                      <div className="flex items-start gap-2.5">
                        <MapPin size={15} className="text-red-500 shrink-0 mt-0.5" />
                        <span>{selectedCinema.address}</span>
                      </div>
                      {selectedCinema.phone && (
                        <div className="flex items-center gap-2.5">
                          <Phone size={15} className="text-red-500 shrink-0" />
                          <span>{selectedCinema.phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedCinema?.mapUrl && (
                        <a
                          href={selectedCinema.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-red-400 hover:text-red-300"
                        >
                          <Navigation size={15} className="shrink-0" />
                          View on Google Maps
                        </a>
                      )}
                </div>

                {/* SHOWTIME */}
                <div>
                  <label className={labelClass}>Show date</label>
                  <div className={fieldBox}>
                    <Clock className="text-gray-500 mr-3" size={18} />
                    <select
                      name="showDate"
                      value={form.showDate || ""}
                      onChange={(e) => {
                        const nextDate = e.target.value;
                        const firstShow = availableShows.find((show) => show.date === nextDate);
                        setForm((f) => ({ ...f, showDate: nextDate, showTime: firstShow?.time || "" }));
                      }}
                      className="w-full bg-transparent outline-none text-sm"
                      required
                    >
                      <option value="" className="text-black">Select a date</option>
                      {availableDates.map((date) => (
                        <option key={date} value={date} className="text-black">
                          {formatShowDate(date)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Showtime</label>
                  <div className={fieldBox}>
                    <Clock className="text-gray-500 mr-3" size={18} />
                    <select
                      name="showTime"
                      value={form.showTime || ""}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm"
                      required
                    >
                      <option value="" className="text-black">Select a time</option>
                      {dateShows.map((show) => (
                        <option key={show.time} value={show.time} className="text-black">
                          {formatShowTime(show.time)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* NAME */}
                <div>
                  <label className={labelClass}>Full Name</label>
                  <div className={fieldBox}>
                    <User className="text-gray-500 mr-3" size={18} />
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Enter your name"
                      value={form.customerName}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm placeholder-gray-600"
                      required
                    />
                  </div>
                </div>

                {/* CONTACT */}
                <div>
                  <label className={labelClass}>Contact Number</label>
                  <div className={fieldBox}>
                    <Phone className="text-gray-500 mr-3" size={18} />
                    <input
                      type="tel"
                      name="contactNo"
                      placeholder="03XX-XXXXXXX"
                      value={form.contactNo}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm placeholder-gray-600"
                      required
                    />
                  </div>
                </div>

                {/* SEATS */}
                <div>
                  <label className={labelClass}>Number of Seats</label>
                  <div className={fieldBox}>
                    <Users className="text-gray-500 mr-3" size={18} />
                    <input
                      type="number"
                      name="seats"
                      min="1"
                      value={form.seats}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving || noCinemas || !locLoaded || availableShows.length === 0 || !form.showTime}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition py-3.5 rounded-xl font-semibold shadow-lg shadow-red-900/20"
                >
                  {saving ? "Booking..." : "Confirm Booking"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#050811] py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} CineBook. All rights reserved.
      </footer>
    </div>
  );
}

export default BookingForm;