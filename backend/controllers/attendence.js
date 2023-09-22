const Attendance = require("../models/Attendence"); // Import your attendance model

const WeeklyOff = require("../models/weeklyoff");

// Function to add attendance record
exports.addAttendance = async (req, res) => {
  try {
    const { date, attendanceData } = req.body;

    // Validate data for each employee here (e.g., employee existence, status validity, etc.)

    // Create an array to store promises for saving attendance records
    const savePromises = attendanceData.map(async (attendanceData) => {
      const { employeeId, status } = attendanceData;

      // Check if the status is "Leave"
      if (status === "leave") {
        //return console.log(employeeId);
        // Find the employee's last weekly off date
        const weeklyOff = await WeeklyOff.findOne({ employee: employeeId });

        if (weeklyOff) {
          const lastOffDate = new Date(weeklyOff.lastOffDate);

          const lastOffDate1 = new Date(lastOffDate);
            // Add 7 days
            const newDate = new Date(lastOffDate1);
            newDate.setDate(newDate.getDate() + 7);

          // Check if the last weekly off date is less than or equal to the current date
          if (newDate <= new Date(date)) {

            // Update the status as "Off" and store the last weekly off date
            const newAttendance = new Attendance({
              employeeId,
              date:date,
              status: `off ${ formatDate(newDate)}`,
              lastOff : newDate,
            });

            //return console.log(newAttendance);
            weeklyOff.lastOffDate = newDate;

            const data = await Promise.all([newAttendance.save(), weeklyOff.save()]);
            //return console.log(first)
          } else {
            // Create a leave record for that date
            const newAttendance = new Attendance({
              employeeId,
              date,
              status: "leave",
            });

            await newAttendance.save();
          }
        } else {
          // Create a leave record for that date if no weekly off data is found
          const newAttendance = new Attendance({
            employeeId,
            date,
            status: "leave",
          });

          await newAttendance.save();
        }
      } else {
        // Create a new attendance record for status other than "Leave"
        const newAttendance = new Attendance({
          employeeId,
          date,
          status,
        });

        await newAttendance.save();
      }
    });

    // Execute all save operations in parallel
    await Promise.all(savePromises);

    res.status(201).json({
      success: true,
      message: "Attendance records added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}; 

// Create a route for adding attendance records for multiple employees
exports.addAttendence1 = async (req, res) => {
  try {
    // Parse the array of attendance data from the request body
    const { date, attendanceData } = req.body;

    //console.log(attendanceData);
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
    res.status(500).json({ message: "Server error" });
  }
};

// Controller function to get attendance data between two dates
exports.getAttendanceBetweenDates = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Fetch attendance data for the specified date range
    const attendanceData = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate({
      path: "employeeId",
      select: "firstName", // Only select the first name
    });

    // Create an array to store the formatted data
    const formattedAttendance = [];

    // Iterate through the attendance data and format it
    attendanceData.forEach((entry) => {
      const { date, employeeId, status } = entry;
      const formattedEntry = {
        date: formatDate(date), // Format the date as needed (e.g., "19-09-2023")
        firstName: employeeId.firstName,
        status,
      };

      formattedAttendance.push(formattedEntry);
    });

    // Send the formatted data as the response
    res.status(200).json(formattedAttendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Helper function to format the date as "DD-MM-YYYY"
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}
