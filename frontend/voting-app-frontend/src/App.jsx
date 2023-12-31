import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import Register from './pages/Register'
import DoVote from './pages/DoVote'
import ErrorPage from "./pages/ErrorPage";
import AdminPanel from "./pages/AdminPanel";
import Success from "./pages/Success";
import RegisterWithAnt from "./pages/RegisterWithAnt";
import LoginPageWithAntD from "./pages/LoginPageWithAntD";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPageWithAntD />} />
        <Route path="/register" element={<RegisterWithAnt />} />
        <Route path="/doVote" element={<DoVote />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/adminPanel" element={<AdminPanel />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;