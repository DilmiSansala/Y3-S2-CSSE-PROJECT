import { FaCalendarAlt } from "react-icons/fa"; // Importing an icon for the calendar
import Calendar from "react-calendar";

const CalendarComponent = ({
  date,
  setDate,
  handleDateClick,
  scheduledDates,
  tileClassName,
}) => {
  return (
    <div className="calendar-container mb-10 bg-gradient-to-r from-green-500 to-green-700 p-8 rounded-lg shadow-xl text-white relative">
      {/* Header with Icon */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-white text-green-600 p-4 rounded-full shadow-md">
        <FaCalendarAlt className="text-3xl" />
      </div>


      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <Calendar
          onChange={(date) => {
            setDate(date);
            handleDateClick(date);
          }}
          value={date}
          selectRange={false}
          tileClassName={tileClassName}
          className="w-full text-green-700"
        />
      </div>
    </div>
  );
};

export default CalendarComponent;
