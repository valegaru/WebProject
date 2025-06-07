import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getUserProfilePicture } from '../../../utils/firebaseUtils';
import ProfileInfo from '../ProfileInfo/ProfileInfo';

const ExpenseCard = ({ event, view }) => {
  const currency = useSelector((state) => state.currency.currency);
  const [status, setStatus] = useState("missing");
  const [profilePics, setProfilePics] = useState({});
  
  const isMonthView = view === 'month';
  const isDayView = view === 'day';
  const isWeekView = view === 'week';

  // Fetch profile pictures like in your original ExpenseCard
  useEffect(() => {
    const fetchPics = async () => {
      const picMap = {};
      await Promise.all(
        Object.values(event.participants || {}).map(async (p) => {
          console.log("Fetching profile picture for participant:", p);
          const url = await getUserProfilePicture(p.userID); 
          console.log(`Fetched URL for ${p.name} (${p.userID}):`, url);
          picMap[p.userID] = url; 
        })
      );
      setProfilePics(picMap);
    };

    if (event.participants) fetchPics();
  }, [event.participants]);

  // Determine sizing based on view and event duration
  const getCardHeight = () => {
    if (isMonthView) return 'auto';
    const duration = moment(event.end).diff(moment(event.start), 'hours', true);
    return Math.max(60, duration * 40) + 'px';
  };

  // Different color schemes for overlapping events
  const getCardColor = () => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];
    return colors[event.id % colors.length];
  };

  return (
    <div 
      className={`calendar-expense-card ${status}`}
      style={{
        height: getCardHeight(),
        padding: isMonthView ? '4px' : '8px',
        background: getCardColor(),
        color: 'white',
        borderRadius: '6px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: isMonthView ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMonthView ? 'flex-start' : 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        gap: '4px'
      }}
    >
      <div className="left-content" style={{ flex: isMonthView ? 'none' : '1' }}>
        <p 
          className="expense-card-title"
          style={{ 
            fontWeight: 'bold',
            fontSize: isMonthView ? '10px' : '12px',
            margin: '0 0 2px 0',
            lineHeight: '1.1',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: isMonthView ? 'nowrap' : 'normal'
          }}
        >
          {event.title}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexDirection: isMonthView ? 'column' : 'row', alignItems: isMonthView ? 'flex-start' : 'center' }}>
          <p 
            className="expense-card-amount"
            style={{ 
              fontSize: isMonthView ? '9px' : '11px',
              margin: 0,
              fontWeight: '600'
            }}
          >
            {Number(event.amount).toLocaleString()} {currency}
          </p>
          {!isMonthView && (
            <p 
              className="expense-card-status"
              style={{ 
                fontSize: '9px',
                margin: 0,
                opacity: 0.8,
                textTransform: 'capitalize'
              }}
            >
              {status}
            </p>
          )}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: isMonthView ? '2px' : '6px', 
        flexDirection: 'row', 
        flexWrap: isMonthView ? 'nowrap' : 'wrap',
        alignItems: 'center',
        maxWidth: isMonthView ? '100%' : 'auto',
        overflow: isMonthView ? 'hidden' : 'visible'
      }}>
        {Object.values(event.participants || {}).slice(0, isMonthView ? 2 : 4).map((p, index) => (
          <div key={index} style={{ transform: isMonthView ? 'scale(0.7)' : 'scale(0.8)' }}>
            <ProfileInfo
              name={p.name}
              imgUrl={profilePics[p.userID] || ""}
              contribution={p.contribution}
              compact={isMonthView}
            />
          </div>
        ))}
        {isMonthView && Object.values(event.participants || {}).length > 2 && (
          <span style={{ fontSize: '8px', opacity: 0.8 }}>
            +{Object.values(event.participants || {}).length - 2}
          </span>
        )}
      </div>
    </div>
  );
};

export default ExpenseCard;