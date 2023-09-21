const express = require("express");
const { login } = require("../controllers/login");
const { addDesignation, getAllDesignation, deleteDesignation } = require("../controllers/designation");
const { createEmployee, getAllEmployees } = require("../controllers/employee");
const { addAttendence } = require("../controllers/attendence");
const router = express.Router();

router.post("/login", login);



//Routes from Employeess

router.post("/addnewemployee",createEmployee);
router.get("/getallemployee",getAllEmployees);

//Routes for  designation functionality
router.post("/addnewdesignation",addDesignation);
router.get("/getalldesignation",getAllDesignation);
router.delete("/deletedesignation/:id",deleteDesignation);

//Routes for attendence

router.post("/addattendence",addAttendence);

module.exports = router;
