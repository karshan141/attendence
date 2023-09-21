import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashbord from "./pages/Dashbord";
import AddNewEployee from "./pages/AddNewEployee";
import AddEmployeeCategory from "./pages/AddEmployeeCategory";
import ViewAllEmployee from "./pages/ViewAllEmployee";
import AddAttendence from "./pages/AddAttendence";

function App() {
  return (
    <div className="bg-slate-400 text-center">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashbaord" element={<Dashbord/>} />
        <Route path="/addemployee" element={<AddNewEployee/>} />
        <Route path="/addemployeecategory" element={<AddEmployeeCategory/>} />
        <Route path="/viewemployee" element={<ViewAllEmployee/>} />

        <Route path="/addattendence" element={<AddAttendence/>} />
      </Routes>
      
    </div>
  );
}

export default App;
