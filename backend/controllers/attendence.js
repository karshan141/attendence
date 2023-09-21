const Attendance = require("../models/Attendence"); // Import your attendance model

// Create a route for adding attendance records for multiple employees
exports.addAttendence = async (req, res) => {
  try {
    // Parse the array of attendance data from the request body
    const { date, attendanceData } = req.body;

    // Validate data for each employee here (e.g., employee existence, date format, status validity, etc.)

    // Create an array to store promises for saving attendance records
    const savePromises = attendanceData.map(async (attendanceData) => {
      const { employeeId, status } = attendanceData;

      const existingAttendance = await Attendance.findOne({
        employeeId,
        date,
      });

      if (existingAttendance) {
        // If a record exists, update it
        existingAttendance.status = status;
        return existingAttendance.save();
      }

      // Create a new attendance record
      const newAttendance = new Attendance({
        employeeId,
        date,
        status,
      });

      // Save the attendance record to the database
      return newAttendance.save();
    });

    // Execute all save operations in parallel
    await Promise.all(savePromises);

    res.status(201).json({
      success: true,
      message: "Attendance records added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
