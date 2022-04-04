// import react from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AllSection from "./component/AllSection";
import Admin from "./Pages/Admin";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<AllSection />} />
          <Route path="/btoBridgeAdministrativeControl/*" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
