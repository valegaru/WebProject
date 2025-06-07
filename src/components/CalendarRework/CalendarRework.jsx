import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ExpenseCard from '../Expenses/ExpenseCard/ExpenseCard';

// Mock data with overlapping events to demonstrate concurrent scheduling
const mockExpenses = [
  {
    id: 1,
    title: 'Grocery Shopping',
    amount: 150.50,
    start: new Date(2025, 5, 10, 10, 0), // June 10, 2025, 10:00 AM
    end: new Date(2025, 5, 10, 11, 30),   // June 10, 2025, 11:30 AM
    participants: {
      user1: { userID: 'user1', name: 'Alice', contribution: 75.25 },
      user2: { userID: 'user2', name: 'Bob', contribution: 75.25 }
    }
  },
  {
    id: 2,
    title: 'Coffee Meeting',
    amount: 15.80,
    start: new Date(2025, 5, 10, 10, 30), // Same day, overlapping time!
    end: new Date(2025, 5, 10, 11, 0),    // June 10, 2025, 10:30-11:00 AM
    participants: {
      user3: { userID: 'user3', name: 'Charlie', contribution: 7.90 },
      user4: { userID: 'user4', name: 'Diana', contribution: 7.90 }
    }
  },
  {
    id: 3,
    title: 'Gas Station',
    amount: 45.00,
    start: new Date(2025, 5, 10, 10, 45), // Another overlapping event!
    end: new Date(2025, 5, 10, 11, 15),   // June 10, 2025, 10:45-11:15 AM
    participants: {
      user1: { userID: 'user1', name: 'Alice', contribution: 45.00 }
    }
  },
  {
    id: 4,
    title: 'Restaurant Dinner',
    amount: 89.99,
    start: new Date(2025, 5, 12, 19, 0), // June 12, 2025, 7:00 PM
    end: new Date(2025, 5, 12, 21, 0),   // June 12, 2025, 9:00 PM
    participants: {
      user1: { userID: 'user1', name: 'Alice', contribution: 45.00 },
      user2: { userID: 'user2', name: 'Bob', contribution: 44.99 }
    }
  },
  {
    id: 5,
    title: 'Bar Tab',
    amount: 67.50,
    start: new Date(2025, 5, 12, 20, 30), // Overlapping with dinner!
    end: new Date(2025, 5, 12, 22, 0),    // June 12, 2025, 8:30-10:00 PM
    participants: {
      user2: { userID: 'user2', name: 'Bob', contribution: 33.75 },
      user3: { userID: 'user3', name: 'Charlie', contribution: 33.75 }
    }
  },
  {
    id: 6,
    title: 'Movie Tickets',
    amount: 24.00,
    start: new Date(2025, 5, 15, 14, 0), // June 15, 2025, 2:00 PM
    end: new Date(2025, 5, 15, 16, 30),  // June 15, 2025, 4:30 PM
    participants: {
      user1: { userID: 'user1', name: 'Alice', contribution: 12.00 },
      user2: { userID: 'user2', name: 'Bob', contribution: 12.00 }
    }
  },
  {
    id: 7,
    title: 'Popcorn & Snacks',
    amount: 18.75,
    start: new Date(2025, 5, 15, 14, 15), // Overlapping with movie!
    end: new Date(2025, 5, 15, 14, 45),   // Short overlapping event
    participants: {
      user1: { userID: 'user1', name: 'Alice', contribution: 9.38 },
      user2: { userID: 'user2', name: 'Bob', contribution: 9.37 }
    }
  }
];

const localizer = momentLocalizer(moment);

const CalendarRework = () => {
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