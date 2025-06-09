import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ExpenseCard from '../Expenses/ExpenseCard/ExpenseCard';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setEvents, setLoading } from '../../store/eventSlice/EventSlice';
import { fetchExpenseEvents } from '../../utils/firebaseUtils';
import { useParams } from 'react-router-dom';
import './CalendarRework.css';

const localizer = momentLocalizer(moment);

const roundToHourBoundaries = (events) =>
	events.map((event) => {
		if (!event.start || !event.end) return event;
		const originalStart = new Date(event.start);
		const originalEnd = new Date(event.end);

		const displayStart = new Date(originalStart);
		displayStart.setMinutes(0, 0, 0);

		const displayEnd = new Date(originalEnd);
		if (displayEnd.getMinutes() > 0 || displayEnd.getSeconds() > 0) {
			displayEnd.setHours(displayEnd.getHours() + 1);
		}
		displayEnd.setMinutes(0, 0, 0);

		return { ...event, originalStart, originalEnd, start: displayStart, end: displayEnd };
	});

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
				const fetched = await fetchExpenseEvents(tripId, expenseId);
				const mapped = fetched.map((evt) => ({
					...evt,
					start: evt.start ? new Date(evt.start) : new Date(),
					end: evt.end ? new Date(evt.end) : new Date(),
					title: evt.title || evt.name || 'Expense Event',
				}));
				dispatch(setEvents(mapped));
			} catch (err) {
				console.error(err);
				dispatch(setError('Failed to load events'));
			} finally {
				dispatch(setLoading(false));
			}
		};
		loadEvents();
	}, [tripId, expenseId, dispatch]);

	const hourBoundaryEvents = useMemo(() => roundToHourBoundaries(events), [events]);

	const EventComponent = ({ event }) => <ExpenseCard event={event} />;

	const formats = useMemo(
		() => ({
			timeGutterFormat: 'HH:mm',
			eventTimeRangeFormat: ({ start, end }, culture, loc) =>
				loc.format(start, 'HH:mm', culture) + ' - ' + loc.format(end, 'HH:mm', culture),
			agendaTimeFormat: 'HH:mm',
			agendaTimeRangeFormat: ({ start, end }, culture, loc) =>
				loc.format(start, 'HH:mm', culture) + ' - ' + loc.format(end, 'HH:mm', culture),
		}),
		[]
	);

	const eventStyleGetter = () => ({
		style: { backgroundColor: 'transparent', border: 'none', borderRadius: '4px', padding: '1px' },
	});

	return (
		<div className='calendar-rework'>
			<div className='calendar-rework__header'>
				{error && <div className='calendar-rework__error'>{error}</div>}
				<div className='calendar-rework__summary'>
					Showing {hourBoundaryEvents.length} event{hourBoundaryEvents.length !== 1 ? 's' : ''}
					{hourBoundaryEvents.length > 0 && ' (rounded to hour boundaries)'}
				</div>
			</div>

			<div className='calendar-rework__calendar-wrap'>
				{loading && events.length === 0 ? (
					<div className='calendar-rework__loading'>Loading events...</div>
				) : (
					<Calendar
						localizer={localizer}
						events={hourBoundaryEvents}
						startAccessor='start'
						endAccessor='end'
						view={view}
						onView={setView}
						date={date}
						onNavigate={setDate}
						components={{ event: EventComponent }}
						eventPropGetter={eventStyleGetter}
						formats={formats}
						style={{ height: '500px' }}
						step={30}
						timeslots={2}
						min={new Date(2025, 0, 1, 6, 0)}
						max={new Date(2025, 0, 1, 23, 0)}
						dayLayoutAlgorithm='no-overlap'
						toolbar={true}
					/>
				)}
			</div>
		</div>
	);
};

export default CalendarRework;
