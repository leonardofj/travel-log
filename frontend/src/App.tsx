import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Countries from "./routes/Countries";
import ResponsiveNavbar from "./components/Navbar";
import Cities from "./routes/Cities";
import Stops from "./routes/Stops";
import Planning from "./routes/Plans";

const App: React.FC = () => (
  <BrowserRouter>
    <ResponsiveNavbar></ResponsiveNavbar>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="countries/" element={<Countries />} />
      <Route path="cities/" element={<Cities />} />
      <Route path="stops/" element={<Stops />} />
      <Route path="planning/" element={<Planning />} />
    </Routes>
  </BrowserRouter>
);

export default App;
