import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashbord from "./pages/Dashbord";
import AddNewEployee from "./pages/AddNewEployee";
import AddEmployeeCategory from "./pages/AddEmployeeCategory";
import ViewAllEmployee from "./pages/ViewAllEmployee";
import AddAttendence from "./pages/AddAttendence";
import ShowAttendence from "./pages/ShowAttendence";
import AddOffDay from "./pages/AddoffDay";
import ShowEmployeeAttendence from "./pages/ShowEmployeeAttendence";
import PaidHoliday from "./pages/PaidHoliday";

function App() {
  return (
    <div className="bg-slate-400 text-center">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashbaord" element={<Dashbord/>} />
        <Route path="/addemployee" element={<AddNewEployee/>} />
        <Route path="/addemployeecategory" element={<AddEmployeeCategory/>} />
        <Route path="/viewemployee" element={<ViewAllEmployee/>} />

        <Route path="/addoffday" element={<AddOffDay/>} />

        <Route path="/paidholiday" element={<PaidHoliday/>}/>

        <Route path="/addattendence" element={<AddAttendence/>} />
        <Route path="/showattendence" element={<ShowAttendence/>} />

        <Route path="/showemployeeattendence" element={<ShowEmployeeAttendence/>} />
      </Routes>
      
    </div>
  );
}

export default App;
