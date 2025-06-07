import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getUserProfilePicture } from '../../../utils/firebaseUtils';
import ProfileInfo from '../ProfileInfo/ProfileInfo';

const ExpenseCard = ({ event, view }) => {
  const currency = useSelector((state) => state.currency.currency);
  const [status, setStatus] = useState("pending");
  const [profilePics, setProfilePics] = useState({});
  
  const isMonthView = view === 'month';
  const isDayView = view === 'day';
  const isWeekView = view === 'week';

  // Fetch profile pictures
  useEffect(() => {
    const fetchPics = async () => {
      const picMap = {};
      if (event.participants) {
        await Promise.all(
          Object.values(event.participants).map(async (p) => {
            try {
              const url = await getUserProfilePicture(p.userID);
              picMap[p.userID] = url;
            } catch (error) {
              console.error(`Failed to fetch profile picture for ${p.userID}:`, error);
            }
          })
        );
      }
      setProfilePics(picMap);
    };

    fetchPics();
  }, [event.participants]);

  // Enhanced sizing based on view
  const getCardHeight = () => {
    if (isMonthView) return 'auto';
    if (isDayView) {
      const duration = moment(event.end).diff(moment(event.start), 'hours', true);
      return Math.max(80, duration * 60) + 'px';
    }
    return '70px'; // Week view
  };

  // Status-based color schemes with better contrast
  const getCardStyle = () => {
    const baseStyles = {
      height: getCardHeight(),
      padding: isMonthView ? '8px' : '12px',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: isMonthView ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMonthView ? 'flex-start' : 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '2px solid rgba(255,255,255,0.2)',
      gap: '8px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    };

    // Status-based colors
    const statusColors = {
      pending: {
        background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%)',
        color: 'white'
      },
      paid: {
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        color: 'white'
      },
      overdue: {
        background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
        color: 'white'
      },
      partial: {
        background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
        color: 'white'
      },
      missing: {
        background: 'linear-gradient(135deg, #9E9E9E 0%, #757575 100%)',
        color: 'white'
      }
    };

    return {
      ...baseStyles,
      ...statusColors[status]
    };
  };

  // Format amount with better visibility
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(Number(amount));
  };

  // Get participant count display
  const getParticipantCount = () => {
    const participants = Object.values(event.participants || {});
    return participants.length;
  };

  // Get status indicator
  const getStatusIndicator = () => {
    const indicators = {
      pending: '⏳',
      paid: '✅',
      overdue: '❌',
      partial: '🔄',
      missing: '❓'
    };
    return indicators[status] || '⏳';
  };

  return (
    <div 
      className={`calendar-expense-card ${status}`}
      style={getCardStyle()}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.zIndex = '10';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.zIndex = '1';
      }}
    >
      {/* Status indicator badge */}
      <div style={{
        position: 'absolute',
        top: '4px',
        right: '4px',
        fontSize: isMonthView ? '10px' : '12px',
        opacity: 0.9
      }}>
        {getStatusIndicator()}
      </div>

      {/* Main content */}
      <div className="expense-content" style={{ 
        flex: 1,
        minWidth: 0 // Prevents flex item from overflowing
      }}>
        {/* Title */}
        <div 
          className="expense-title"
          style={{ 
            fontWeight: 'bold',
            fontSize: isMonthView ? '11px' : isDayView ? '14px' : '12px',
            margin: '0 0 4px 0',
            lineHeight: '1.2',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: isMonthView ? 'nowrap' : 'normal',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
          title={event.title} // Tooltip for full title
        >
          {event.title}
        </div>

        {/* Amount and time */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMonthView ? 'column' : 'row',
          alignItems: isMonthView ? 'flex-start' : 'center',
          gap: isMonthView ? '2px' : '8px',
          marginBottom: isMonthView ? '4px' : '8px'
        }}>
          <div 
            className="expense-amount"
            style={{ 
              fontSize: isMonthView ? '10px' : isDayView ? '13px' : '11px',
              fontWeight: '700',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              background: 'rgba(255,255,255,0.2)',
              padding: '2px 6px',
              borderRadius: '10px',
              display: 'inline-block'
            }}
          >
            {formatAmount(event.amount)} {currency}
          </div>
          
          {!isMonthView && (
            <div 
              className="expense-time"
              style={{ 
                fontSize: '9px',
                opacity: 0.9,
                background: 'rgba(0,0,0,0.2)',
                padding: '2px 4px',
                borderRadius: '6px'
              }}
            >
              {moment(event.start).format('HH:mm')}
            </div>
          )}
        </div>

        {/* Participants section */}
        {!isMonthView && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '4px',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              fontSize: '9px', 
              opacity: 0.9,
              marginRight: '4px'
            }}>
              👥 {getParticipantCount()}
            </span>
            
            {/* Profile pictures */}
            {Object.values(event.participants || {}).slice(0, 3).map((p, index) => (
              <div 
                key={index} 
                style={{ 
                  transform: 'scale(0.7)',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                }}
              >
                <ProfileInfo
                  name={p.name}
                  imgUrl={profilePics[p.userID] || ""}
                  contribution={p.contribution}
                  compact={true}
                />
              </div>
            ))}
            
            {Object.values(event.participants || {}).length > 3 && (
              <span style={{ 
                fontSize: '8px', 
                opacity: 0.9,
                background: 'rgba(255,255,255,0.3)',
                padding: '2px 4px',
                borderRadius: '8px'
              }}>
                +{Object.values(event.participants || {}).length - 3}
              </span>
            )}
          </div>
        )}

        {/* Month view compact info */}
        {isMonthView && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '8px',
            opacity: 0.9
          }}>
            <span>👥 {getParticipantCount()}</span>
            <span>{moment(event.start).format('HH:mm')}</span>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: status === 'paid' ? '#4CAF50' : 
                   status === 'overdue' ? '#f44336' :
                   status === 'partial' ? '#2196F3' : '#ff9800',
        opacity: 0.8
      }} />
    </div>
  );
};

export default ExpenseCard;