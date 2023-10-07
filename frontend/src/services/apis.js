const BASE_URL = process.env.REACT_APP_BASE_URL;
// const BASE_URL = "https://mernbackend123.onrender.com";

export const login = {
  LOGIN_API: BASE_URL + "/user/login",
};

export const addNewCategory = {
  ADDCATEGORY_API: BASE_URL + "/user/addnewdesignation",
  GET_ALL_CATEGORY_API: BASE_URL + "/user/getalldesignation",
  DELETECATEGORY_API: BASE_URL + "/user/deletedesignation",
  EDITCATEGORY_API: BASE_URL + "/user/editdesignation",
};

export const getAllCategory = {
  GET_ALL_CATEGORY_API: BASE_URL + "/user/getalldesignation",
};

export const employeeApis = {
  ADDNEWEMPLOYEE_API: BASE_URL + "/user/addnewemployee",
  GET_ALL_EMPLOYEE_APPI: BASE_URL + "/user/getallemployee",
  GET_TYPE_WISE_EMPLOYEE_APPI: BASE_URL + "/user/gettypewiseemp",
};

export const attendanceApis = {
  ADDATTENDENCE_API: BASE_URL + "/user/addattendence",
  ATTENDANCE_MUSTER_API: BASE_URL + "/user/showattendence",
  GET_ATTENDANCE_DATA_FOR_DATE_API:
    BASE_URL + "/user/showattendencedatespecific",
  GET_EMPLOYEE_WISE_ATTENDENCE_APPI: BASE_URL + "/user/showEmployeeattendence",
  UPDATE_EMPLOYEE_ATTENDENCE_API: BASE_URL + "/user/editempattendence",
};

export const weeklyOffApis = {
  SETWEEKLYOFF_API: BASE_URL + "/user/addweeklyoff",
};

export const paidHolidayApis = {
  ADD_PAIHOLIDAY_API: BASE_URL + "/user/addph",
};

export const dashbordData = {
  COUNT_CATEGORY_WISE_EMPLOYEE: BASE_URL + "/user/countemployeetypewise",
  COUNT_PENDING_OFF: BASE_URL + "/user/countpendingoff",
};
