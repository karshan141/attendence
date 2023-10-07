const { countOffDays } = require("../helper/commonuses");
const Employee = require("../models/Employee");
const Weeklyoff = require("../models/weeklyoff");

exports.countEmployeeType = async (req, res) => {
  try {
    const employees = await Employee.find().populate("category").exec(); // Execute the query with population

    if (!employees) {
      return res.status(200).json({
        success: false,
        message: `Employees Not Found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Employee Get SuccessFully`,
      employees,
    });

    //console.log(employees);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: `Server Error`,
    });
  }
};

exports.countPendingOff = async (req, res) => {
  try {
    const lastOffData = await Weeklyoff.find()
      .populate("employee")
      .populate({
        path: "employee",
        populate: {
          path: "category",
        },
      });

    const employeeOffs = {};

    lastOffData.forEach((data) => {
      const category = data.employee.category.designation;
      const lastOffDate = data.lastOffDate;

      if (!employeeOffs[category]) {
        employeeOffs[category] = 0; // Initialize the array if it doesn't exist
      }

      const offDays = countOffDays(data.lastOffDate);

      employeeOffs[category] += offDays; // Add the lastOffDate to the category array
    });

    return res.status(200).json({
      success: true,
      message: `Employee Off Counted`,
      employeeOffs,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: `Server Error`,
    });
  }
};
