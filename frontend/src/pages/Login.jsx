import React, { useState } from "react";
import { FaEyeSlash ,FaEye} from "react-icons/fa";

const Login = () => {
  const [loginData, setLoginData] = useState({
    userName: "",
    password: "",
  });
  const [showHidePass, setShowHidePass] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handelLogin = (e) => {
    e.preventDefault();
    setLoginData({
      userName: "",
      password: "",
    });
  };

//   const handelShowHide = () =>{
//     setShowHidePass(!showHidePass);
//   }

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-teal-500">
      <div className="lg:w-3/12 bg-[#E91E63]  rounded-lg shadow-2xl">
        <p className="text-4xl border-b-2 w-full mt-8 pb-4">Login</p>
        <div className="py-8 px-16">
          <form className="flex flex-col gap-8" onSubmit={handelLogin}>
            <div className="flex flex-col justify-start gap-1">
              <label className="font-bold text-2xl text-start">Usename</label>
              <input
                type="text"
                name="userName"
                placeholder="Enter User Name"
                value={loginData.userName}
                onChange={handleInputChange}
                className="h-[50px] rounded py-2 px-4 text-slate-900 text-2xl font-semibold"
              />
            </div>

            <div className="flex flex-col justify-start gap-1">
              <label className="font-bold text-2xl text-start">Password</label>
              <div className="flex relative items-center">
                <input
                  type={showHidePass ?"password" : "text"}
                  name="password"
                  placeholder="Enter User Name"
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="h-[40px] rounded p-2 px-4 pr-16 text-slate-900 text-2xl font-semibold max-w-full"
                />

                {showHidePass ? (
                    <FaEyeSlash
                  className="absolute z-1 text-slate-900 right-0 text-xl p-2 rounded-r w-auto cursor-pointer bg-slate-600 h-full"
                  onClick={()=>setShowHidePass(!showHidePass)}
                />
                )
                
                :(<FaEye
                  className="absolute z-1 text-slate-900 right-0 text-xl p-2 rounded-r w-auto cursor-pointer bg-slate-600 h-full"
                  onClick={()=>setShowHidePass(!showHidePass)}
                />)}
                
              </div>
            </div>

            <div className="flex justify-center items-center gap-3">
              <button className="bg-[#FEFEFE] font-bold text-2xl text-[#20487F] py-2 px-6 rounded-lg transition-all duration-200 hover:bg-[#20487F] hover:text-white">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
