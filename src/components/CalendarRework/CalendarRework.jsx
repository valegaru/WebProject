import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ExpenseCard from '../Expenses/ExpenseCard/ExpenseCard';
import { useDispatch, useSelector } from 'react-redux';
import { clearEvents, setError, setEvents, setLoading } from '../../store/eventSlice/EventSlice';
import { fetchExpenseEvents } from '../../utils/firebaseUtils';
import { useParams } from 'react-router-dom';

const localizer = momentLocalizer(moment);

// Utility function to round events to hour boundaries
const roundToHourBoundaries = (events) => {
  return events.map(event => {
    if (!event.start || !event.end) {
      return event;
    }

    const originalStart = new Date(event.start);
    const originalEnd = new Date(event.end);

    // Round start time DOWN to hour boundary (9:20 -> 9:00)
    const displayStart = new Date(originalStart);
    displayStart.setMinutes(0, 0, 0);

    // Round end time UP to next hour boundary (12:40 -> 13:00)
    const displayEnd = new Date(originalEnd);
    if (displayEnd.getMinutes() > 0 || displayEnd.getSeconds() > 0) {
      displayEnd.setHours(displayEnd.getHours() + 1);
    }
    displayEnd.setMinutes(0, 0, 0);

    return {
      ...event,
      // Store original times for display in ExpenseCard
      originalStart,
      originalEnd,
      // Set rounded times for calendar layout
      start: displayStart,
      end: displayEnd
    };
  });
};

const CalendarRework = () => {
  const { tripId, expenseId } = useParams();
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const loadEvents = async () => {
      if (!tripId || !expenseId) return;
      
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      try {
        // Fetch events from Firebase
        const fetchedEvents = await fetchExpenseEvents(tripId, expenseId);
        
        // Transform events to match calendar format
        const calendarEvents = fetchedEvents.map(event => ({
          ...event,
          start: event.start ? new Date(event.start) : new Date(),
          end: event.end ? new Date(event.end) : new Date(),
          title: event.title || event.name || 'Expense Event'
        }));
        
        // Set events in Redux store
        dispatch(setEvents(calendarEvents));
        console.log(calendarEvents, "logged")
      } catch (err) {
        console.error('Error loading events:', err);
        dispatch(setError('Failed to load events'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadEvents();
  }, [tripId, expenseId, dispatch]);

  // Process events with hour boundaries
  const hourBoundaryEvents = useMemo(() => {
    return roundToHourBoundaries(events);
  }, [events]);

  // Custom event component
  const EventComponent = ({ event }) => (
    <ExpenseCard event={event} />
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

  // Handle refresh events
  const handleRefresh = async () => {
    if (!tripId || !expenseId) return;
    
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      const fetchedEvents = await fetchExpenseEvents(tripId, expenseId);
      
      const calendarEvents = fetchedEvents.map(event => ({
        ...event,
        start: event.start ? new Date(event.start) : new Date(),
        end: event.end ? new Date(event.end) : new Date(),
        title: event.title || event.name || 'Expense Event'
      }));
      
      dispatch(setEvents(calendarEvents));
    } catch (err) {
      dispatch(setError('Failed to refresh events'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div style={{ height: '600px', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0 }}>Hour-Spanning Expense Calendar</h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        
        {error && (
          <div style={{
            padding: '10px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            {error}
          </div>
        )}
        
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
        
        <div style={{ fontSize: '14px', color: '#666' }}>
          Showing {hourBoundaryEvents.length} event{hourBoundaryEvents.length !== 1 ? 's' : ''} 
          {hourBoundaryEvents.length > 0 && ' (rounded to hour boundaries)'}
        </div>
      </div>

      {loading && events.length === 0 ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '500px',
          fontSize: '16px',
          color: '#666'
        }}>
          Loading events...
        </div>
      ) : (
        <Calendar
          localizer={localizer}
          events={hourBoundaryEvents} // Use hour-boundary events
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
      )}
    </div>
  );
};

export default CalendarRework;