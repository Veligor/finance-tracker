// import React from "react";
// import MainLayout from "./layouts/MainLayout";
// import Home from "./pages/Home/Home";
// import Stats from "./pages/Stats/Stats";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// export default function App() {
//   return (
//     <MainLayout>
//       <Home />
//       <Route path="/stats" element={<Stats />} />
//     </MainLayout>
//   );
// }
import React from "react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import Stats from "./pages/Stats/Stats";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
