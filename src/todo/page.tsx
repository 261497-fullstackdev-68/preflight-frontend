import "./todo.css";
import { useState } from "react";
import dayjs from "dayjs";

// Thailand day colors: Sunday=red, Monday=yellow, Tuesday=pink, Wednesday=green, Thursday=orange, Friday=blue, Saturday=purple
const thaiDayColors = [
  "bg-red-500/20", // Sunday
  "bg-yellow-500/20", // Monday
  "bg-pink-500/20", // Tuesday
  "bg-green-500/20", // Wednesday
  "bg-orange-500/20", // Thursday
  "bg-blue-500/20", // Friday
  "bg-purple-500/20", // Saturday
];

function getWeekDates(refDate: dayjs.Dayjs) {
  const startOfWeek = refDate.startOf("week"); // Sunday as start
  return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
}

function Todo() {
  const [weekStart, setWeekStart] = useState(dayjs().startOf("week"));

  const weekDates = getWeekDates(weekStart);
  // Calculate month(s) for current week
  const startMonth = weekDates[0].format("MMMM");
  const endMonth = weekDates[6].format("MMMM");
  const year = weekDates[0].format("YYYY");
  const endYear = weekDates[6].format("YYYY");
  const monthText =
    startMonth === endMonth && year === endYear
      ? `${startMonth}, ${year}`
      : `${startMonth} ${year} - ${endMonth} ${endYear}`;

  const handleNextWeek = () => {
    setWeekStart(weekStart.add(1, "week"));
  };

  const handlePrevWeek = () => {
    setWeekStart(weekStart.subtract(1, "week"));
  };

  return (
    <div>
      <header className="flex items-center mb-4">
        <h1 className="m-0 text-5xl font-bold">{monthText}</h1>
      </header>
      <div className="flex justify-between mb-6">
        <button
          onClick={handlePrevWeek}
          className="mr-4 px-4 py-2 border rounded hover:bg-gray-200 hover:cursor-pointer"
        >
          {"<"}
        </button>
        <button
          onClick={handleNextWeek}
          className="ml-4 px-4 py-2 border rounded hover:bg-gray-200 hover:cursor-pointer"
        >
          {">"}
        </button>
      </div>
      <table
        className="border-collapse w-full"
        style={{
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: "8%" }} /> {/* Hour column */}
          {weekDates.map((_, idx) => (
            <col key={idx} style={{ width: "13.14%" }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="text-center py-3 border bg-gray-200">Hour</th>
            {weekDates.map((date, idx) => {
              const isToday = date.isSame(dayjs(), "day");
              return (
                <th
                  key={date.format("ddd")}
                  className={`text-center py-3 border ${thaiDayColors[idx]} ${
                    isToday ? `ring-3 ring-blue-500 ${thaiDayColors[idx]}` : ""
                  }`}
                >
                  {date.format("ddd")} {date.format("D")}th
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 24 }, (_, hour) => (
            <tr key={hour}>
              <td className="py-2 border text-center font-semibold">
                {hour}:00
              </td>
              {weekDates.map((_, idx) => (
                <td
                  key={idx}
                  className={`py-6 border text-center 
                  `}
                >
                  {/* Cell content here */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="fixed bottom-8 right-8 bg-gray-900 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl hover:cursor-pointer"
        aria-label="Add"
      >
        +
      </button>
      {/* Place your PNG file in the public folder, e.g. public/notification.png */}
      <button
        className="fixed top-8 right-8  rounded-full w-14 h-14 flex items-center justify-center z-50 hover:cursor-pointer"
        aria-label="Notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M4 8a6 6 0 0 1 4.03-5.67a2 2 0 1 1 3.95 0A6 6 0 0 1 16 8v6l3 2v1H1v-1l3-2zm8 10a2 2 0 1 1-4 0z" />
        </svg>
      </button>
    </div>
  );
}

export default Todo;
