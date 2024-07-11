import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Countries from "./routes/Countries";
import ResponsiveNavbar from "./components/Navbar";
import Cities from "./routes/Cities";
import Stops from "./routes/Stops";
import CountryDetail from "./routes/CountryDetail";
import TripDetail from "./routes/TripDetail";
import PlanDetail from "./routes/PlanDetail";

const App: React.FC = () => (
  <BrowserRouter>
    <ResponsiveNavbar></ResponsiveNavbar>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="countries/" element={<Countries />} />
      <Route path="countries/:id" element={<CountryDetail />} />
      <Route path="trips/:id" element={<TripDetail />} />
      <Route path="cities/" element={<Cities />} />
      <Route path="stops/" element={<Stops />} />
      <Route path="planning/:id" element={<PlanDetail />} />
    </Routes>
  </BrowserRouter>
);

export default App;
