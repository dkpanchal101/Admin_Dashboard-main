import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/common/Header";
import { ChevronLeft, ChevronRight } from "lucide-react";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
  };

  const handleAddEvent = () => {
    if (newTitle.trim() && selectedSlot) {
      const newEvent = {
        title: newTitle.trim(),
        start: selectedSlot.start,
        end: selectedSlot.end,
      };
      setEvents([...events, newEvent]);
      setSelectedSlot(null);
      setNewTitle("");
    }
  };

  const handleSelectEvent = (eventToDelete) => {
    if (window.confirm(`Delete event: "${eventToDelete.title}"?`)) {
      setEvents(events.filter((event) => event !== eventToDelete));
    }
  };

  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="rbc-toolbar flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-2 gap-3" style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            onNavigate("TODAY");
            setCurrentDate(new Date());
          }}
          className="px-3 py-1 rounded border"
          style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
        >
          Today
        </button>
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="px-3 py-1 rounded border"
          style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
        >
          {sidebarOpen ? "Hide Events" : "Show Events"}
        </button>
      </div>
      <div className="text-xl font-semibold" style={{ color: "rgb(var(--text))" }}>{label}</div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const newDate = moment(currentDate).subtract(1, currentView).toDate();
            setCurrentDate(newDate);
            onNavigate("PREV");
          }}
          className="p-2 rounded border"
          style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
          title="Previous"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => {
            const newDate = moment(currentDate).add(1, currentView).toDate();
            setCurrentDate(newDate);
            onNavigate("NEXT");
          }}
          className="p-2 rounded border"
          style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
          title="Next"
        >
          <ChevronRight />
        </button>
        <select
          onChange={(e) => {
            const view = e.target.value;
            onView(view);
            setCurrentView(view);
          }}
          value={currentView}
          className="rounded px-2 py-1 ml-2 border"
          style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
        >
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="flex-1 h-screen overflow-auto relative z-10">
      <Header title="Calendar" />

      <div className="flex h-screen">
        {/* Left Sidebar */}
        {sidebarOpen && (
          <div className="w-72 p-4 border-r hidden sm:block" style={{ backgroundColor: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "rgb(var(--text))" }}>Events</h2>
            {events.length === 0 ? (
              <p className="muted">No events</p>
            ) : (
              events.map((event, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded mb-3 cursor-pointer transition"
                  style={{ backgroundColor: "rgba(52,211,153,0.2)", color: "rgb(var(--text))" }}
                  onClick={() => handleSelectEvent(event)}
                >
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-sm">
                    {moment(event.start).format("MMM D, YYYY")}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Calendar */}
        <div className="flex-1 h-screen p-4 shadow-xl mt-0" style={{ backgroundColor: "rgb(var(--card))" }}>
          <Calendar
            localizer={localizer}
            events={events}
            selectable
            date={currentDate}
            view={currentView}
            onView={(view) => setCurrentView(view)}
            onNavigate={(date) => setCurrentDate(date)}
            min={new Date(1900, 0, 1)}
            max={new Date(2100, 11, 31)}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            components={{ toolbar: CustomToolbar }}
            style={{ height: "80vh" }}
            className="custom-calendar"
          />
        </div>
      </div>

      {/* Sidebar for Add Event */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-96 shadow-lg z-50 border-l"
            style={{ backgroundColor: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-xl font-bold mb-4" style={{ color: "rgb(var(--brand-strong))" }}>Add Event</h3>
              <input
                type="text"
                className="w-full px-4 py-2 mb-4 rounded border"
                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
                placeholder="Event Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <div className="flex justify-end mt-auto gap-3">
                <button
                  className="btn"
                  onClick={() => setSelectedSlot(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAddEvent}
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom calendar styles */}
      <style>{`
        .custom-calendar .rbc-toolbar {
          background-color: rgb(var(--card));
          color: rgb(var(--text));
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .custom-calendar .rbc-toolbar button {
          background-color: rgb(var(--card));
          color: rgb(var(--text));
          border: 1px solid rgb(var(--border));
          padding: 0.5rem 1rem;
          margin: 0 0.25rem;
          border-radius: 0.375rem;
        }
        .custom-calendar .rbc-toolbar button.rbc-active {
          background-color: rgb(var(--brand));
          color: white;
        }
        .custom-calendar .rbc-month-view {
          background-color: rgb(var(--card));
        }
        .custom-calendar .rbc-date-cell {
          color: rgb(var(--muted));
        }
        .custom-calendar .rbc-selected-cell {
          background-color: rgb(var(--brand)) !important;
          color: white;
        }
        .custom-calendar .rbc-event {
          background-color: rgba(52,211,153,0.8);
          border: none;
          color: black;
        }
        .custom-calendar .rbc-day-bg.rbc-today {
          background-color: rgba(99,102,241,0.2);
        }
        .custom-calendar .rbc-header {
          background-color: rgb(var(--card));
          color: rgb(var(--text));
          padding: 0.5rem;
          border-bottom: 1px solid rgb(var(--border));
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;
