import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Start from "./components/Start";

function App() {
  return (
    <div className="bg-slate-400 text-center">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/start" element={<Start />} />
      </Routes>
      
    </div>
  );
}

export default App;
