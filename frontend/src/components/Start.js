import React, { useEffect, useState } from "react";
import axios from "axios";

const Start = () => {
  const [text, setText] = useState();

  const getDummyData = async () => {
    const responce = await axios.get("http://localhost:4000/");
    setText(responce.data);
  };

  useEffect(()=>{
    getDummyData();
  },[])
  return <div>{text}</div>;
};

export default Start;
