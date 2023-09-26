const Attendance = require("../models/Attendence"); // Import your attendance model

const WeeklyOff = require("../models/weeklyoff"); // Import Weeklyoff Model

const PaidHoliday = require("../models/PaidHoliday"); // import paidholiday model

const EmpPaidHoliday = require("../models/EmpPaidHoliday");

const { formatDate } = require("../helper/commonuses");

//const formatDate = require("../helper/commonuses"); // import helper function to formateDate

// Function to add attendance record
exports.addAttendance = async (req, res) => {
  try {
    const { date, attendanceData } = req.body;

    // Validate data for each employee here (e.g., employee existence, status validity, etc.)

    // Create an array to store promises for saving attendance records
    const savePromises = attendanceData.map(async (attendanceData) => {
      const { employeeId, status } = attendanceData;

      const isAttend = await Attendance.find({
        employeeId,
        date: new Date(date),
      }).count();

      //console.log("123", isAttend);

      if (!isAttend) {
        // Check if the status is "Leave"
        if (status === "leave") {
          const phList = await PaidHoliday.find({
            date: {
              $gte: new Date(`${date.split("-")[0]}-01-01`),
              $lte: new Date(`${date.split("-")[0]}-12-31`),
            },
          })
            .select({ date: 1 })
            .sort({ date: 1 });

          const utilizedPhListArray = await EmpPaidHoliday.find({
            employee: employeeId,
          })
            .select({ date: 1, _id: 0 })
            .sort({ date: 1 });

          let setPhDate = new Date();
          if (utilizedPhListArray.length === 0) {
            setPhDate = phList[0].date;
            setPhId = phList[0]._id;
          } else {
            const currentDate =
              utilizedPhListArray[utilizedPhListArray.length - 1].date; // Get the first date in the array

            // Find the index of the current date in phList
            const index = phList.findIndex(
              (item) => item.date.getTime() === currentDate.getTime()
            );

            if (index !== -1 && index < phList.length - 1) {
              // Get the next date from phList
              setPhDate = phList[index + 1].date;
              setPhId = phList[index + 1]._id;
            } else {
              setPhDate = "3023-09-25T13:25:48.512Z";
            }
          }

          // console.log(phList);
          // return console.log(setPhDate);

          if (setPhDate <= new Date(date)) {
            // Create a PH entry and decrement pending PH count
            const newAttendance = new Attendance({
              employeeId,
              date,
              status: `ph ${formatDate(setPhDate)}`,
            });

            await newAttendance.save();
            const newPaidHoliday = new EmpPaidHoliday({
              employee: employeeId,
              paidHoliday: setPhId,
              date: setPhDate,
            });

            await newPaidHoliday.save();
          } else {
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
                  date: date,
                  status: `off ${formatDate(newDate)}`,
                  lastOff: newDate,
                });

                //return console.log(newAttendance);
                weeklyOff.lastOffDate = newDate;

                const data = await Promise.all([
                  newAttendance.save(),
                  weeklyOff.save(),
                ]);
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
      } else {
        console.log("false");
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

exports.getEmployeeAttendanceBetweenDates = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;

    // Fetch attendance data for the specified date range
    const attendanceData = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    }).populate({
      path: "employeeId",
      select: "firstName", // Only select the first name
    });

    console.log(endDate);

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
