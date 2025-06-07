import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ExpenseCard from '../Expenses/ExpenseCard/ExpenseCard';
import { useDispatch, useSelector } from 'react-redux';


const localizer = momentLocalizer(moment);

const CalendarRework = () => {  

  const dispatch = useDispatch()
  const events = useSelector((state) => state.events);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  // Custom event component
  const EventComponent = ({ event }) => (
    <ExpenseCard event={event} view={view} />
  );

  // Custom event style getter
  const eventStyleGetter = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '4px',
        padding: '1px'
      }
    };
  };

  const formats = useMemo(() => ({
    timeGutterFormat: 'HH:mm',
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      localizer.format(start, 'HH:mm', culture) + ' - ' + 
      localizer.format(end, 'HH:mm', culture),
    agendaTimeFormat: 'HH:mm',
    agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
      localizer.format(start, 'HH:mm', culture) + ' - ' + 
      localizer.format(end, 'HH:mm', culture)
  }), []);

  return (
    <div style={{ height: '600px', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '10px' }}>Expense Calendar</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button 
            onClick={() => setView('month')}
            style={{
              padding: '8px 16px',
              backgroundColor: view === 'month' ? '#667eea' : '#f0f0f0',
              color: view === 'month' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Month
          </button>
          <button 
            onClick={() => setView('week')}
            style={{
              padding: '8px 16px',
              backgroundColor: view === 'week' ? '#667eea' : '#f0f0f0',
              color: view === 'week' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Week
          </button>
          <button 
            onClick={() => setView('day')}
            style={{
              padding: '8px 16px',
              backgroundColor: view === 'day' ? '#667eea' : '#f0f0f0',
              color: view === 'day' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Day
          </button>
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={mockExpenses}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        components={{
          event: EventComponent
        }}
        eventPropGetter={eventStyleGetter}
        formats={formats}
        style={{ height: '500px' }}
        step={30}
        timeslots={2}
        min={new Date(2025, 0, 1, 6, 0)} // 6 AM
        max={new Date(2025, 0, 1, 23, 0)} // 11 PM
        dayLayoutAlgorithm="no-overlap"
      />
    </div>
  );
};

export default CalendarRework;