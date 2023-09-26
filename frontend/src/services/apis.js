const BASE_URL = process.env.REACT_APP_BASE_URL;

export const login = {
  LOGIN_API: BASE_URL + "/user/login",
};

export const addNewCategory = {
  ADDCATEGORY_API: BASE_URL + "/user/addnewdesignation",
  GET_ALL_CATEGORY_API: BASE_URL + "/user/getalldesignation",
  DELETECATEGORY_API: BASE_URL + "/user/deletedesignation",
};

export const getAllCategory = {
  GET_ALL_CATEGORY_API: BASE_URL + "/user/getalldesignation",
};

export const employeeApis = {
  ADDNEWEMPLOYEE_API: BASE_URL + "/user/addnewemployee",
  GET_ALL_EMPLOYEE_APPI: BASE_URL + "/user/getallemployee",
};

export const attendanceApis = {
  ADDATTENDENCE_API: BASE_URL + "/user/addattendence",
  GET_ATTENDANCE_DATA_FOR_DATE_API:
    BASE_URL + "/user/showattendencedatespecific",
};

export const weeklyOffApis = {
  SETWEEKLYOFF_API: BASE_URL + "/user/addweeklyoff",
};

export const paidHolidayApis = {
  ADD_PAIHOLIDAY_API: BASE_URL + "/user/addph",
};
