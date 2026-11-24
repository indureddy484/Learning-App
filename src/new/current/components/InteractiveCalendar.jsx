
import React, { useState } from "react";
import "./InteractiveCalendar.css";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

function InteractiveCalendar({
  onDateSelect = () => {},
  onBack = () => {},
}) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    today.getMonth()
  );

  const [currentYear, setCurrentYear] = useState(
    today.getFullYear()
  );

  const [selectedDate, setSelectedDate] = useState(null);

  const firstDay = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  // Previous Month
  const previousMonth = () => {
    setSelectedDate(null);

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonth((month) => month - 1);
    }
  };

  // Next Month
  const nextMonth = () => {
    setSelectedDate(null);

    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonth((month) => month + 1);
    }
  };

  // Go to Today
  const goToToday = () => {
    const currentDate = new Date();

    setCurrentMonth(currentDate.getMonth());
    setCurrentYear(currentDate.getFullYear());
    setSelectedDate(currentDate.getDate());

    onDateSelect(currentDate);
  };

  // Select Date
  const handleDateClick = (day) => {
    setSelectedDate(day);

    const date = new Date(
      currentYear,
      currentMonth,
      day
    );

    onDateSelect(date);
  };

  // Check Today
  const isToday = (day) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  // Selected Full Date
  const selectedFullDate = selectedDate
    ? new Date(currentYear, currentMonth, selectedDate)
    : null;

  return (
    <div className="interactive-calendar-screen">

      <div className="interactive-calendar-container">

        {/* Back Button */}

        <button
          type="button"
          className="calendar-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        {/* Calendar Heading */}

        <div className="calendar-heading">

          <div>
            <h1>My Calendar</h1>
            <p>Explore the days and dates!</p>
          </div>

          <button
            className="calendar-today-button"
            onClick={goToToday}
            type="button"
          >
            Today
          </button>

        </div>

        {/* Month Navigation with Selected Date */}

        <div className="calendar-month-navigation">

          <button
            type="button"
            className="calendar-navigation-button"
            onClick={previousMonth}
            aria-label="Previous month"
          >
            ❮
          </button>

          <div className="calendar-month-title">

            {/* Selected Date Display */}

            <div className="calendar-selected-date-display">

              {selectedFullDate ? (
                <>
                  <span className="selected-date-number">
                    {selectedFullDate.getDate()}
                  </span>

                  <span className="selected-date-weekday">
                    {WEEKDAYS[selectedFullDate.getDay()]}
                  </span>
                </>
              ) : (
                <span className="selected-date-placeholder">
                  Select a date
                </span>
              )}

            </div>

            {/* Month and Year */}

            <h2>
              {MONTHS[currentMonth]} {currentYear}
            </h2>

          </div>

          <button
            type="button"
            className="calendar-navigation-button"
            onClick={nextMonth}
            aria-label="Next month"
          >
            ❯
          </button>

        </div>

        {/* Calendar Grid */}

        <div className="calendar-grid">

          {/* Weekday Headings */}

          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={`calendar-weekday ${
                index === 0
                  ? "calendar-sunday"
                  : index === 6
                  ? "calendar-saturday"
                  : ""
              }`}
            >
              {day}
            </div>
          ))}

          {/* Empty Spaces Before First Date */}

          {Array.from(
            { length: firstDay },
            (_, index) => (
              <div
                key={`empty-${index}`}
                className="calendar-empty-day"
              />
            )
          )}

          {/* Actual Dates */}

          {Array.from(
            { length: daysInMonth },
            (_, index) => {
              const day = index + 1;

              const selected = selectedDate === day;
              const todayDate = isToday(day);

              const weekday = new Date(
                currentYear,
                currentMonth,
                day
              ).getDay();

              return (
                <button
                  key={day}
                  type="button"
                  className={`calendar-date ${
                    todayDate ? "calendar-today" : ""
                  } ${
                    selected ? "calendar-selected" : ""
                  } ${
                    weekday === 0
                      ? "calendar-date-sunday"
                      : ""
                  }`}
                  onClick={() => handleDateClick(day)}
                  aria-label={`${MONTHS[currentMonth]} ${day}, ${currentYear}`}
                  aria-pressed={selected}
                >
                  <span>{day}</span>

                  {todayDate && (
                    <small>Today</small>
                  )}

                </button>
              );
            }
          )}

        </div>

        {/* Calendar Legend */}

        <div className="calendar-legend">

          <div>
            <span className="legend-dot today-dot" />
            <span>Today</span>
          </div>

          <div>
            <span className="legend-dot selected-dot" />
            <span>Selected Date</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default InteractiveCalendar;
