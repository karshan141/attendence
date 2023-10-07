// Helper function to format the date as "DD-MM-YYYY"
exports.formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

exports.countOffDays = (date) => {
  const currDate = new Date();
  const diff = currDate - date;
  return Math.floor((diff / (24 * 60 * 60 * 1000))/7);
};
