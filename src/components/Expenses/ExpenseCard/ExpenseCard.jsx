import React, { useEffect, useState } from 'react';

const ExpenseCard = ({ event }) => {
  const [profilePics, setProfilePics] = useState({});
  
  // Validate event prop
  if (!event) {
    return <div>No event data</div>;
  }

  // Extract event data with defaults
  const {
    id,
    title = 'Untitled Expense',
    amount = 0,
    start,
    end,
    originalStart,
    originalEnd,
    participants = {},
    status = 'pending',
    currency = 'USD'
  } = event;

  const participantList = Object.values(participants);

  // Generate profile pictures for participants
  useEffect(() => {
    const generateProfilePics = async () => {
      const picMap = {};
      participantList.forEach((participant) => {
        if (participant?.name && participant?.userID) {
          picMap[participant.userID] = 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&size=24&background=random`;
        }
      });
      setProfilePics(picMap);
    };

    if (participantList.length > 0) {
      generateProfilePics();
    }
  }, [participantList]);

  // Utility functions
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(Number(amount) || 0);
  };

  const formatTimeRange = () => {
    if (!start && !originalStart) return '';
    
    const startTime = originalStart || start;
    const endTime = originalEnd || end;
    
    if (!startTime || !endTime) return '';
    
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const getStatusStyles = () => {
    const statusStyles = {
      pending: {
        background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%)',
        borderLeft: '4px solid #ff6b35'
      },
      paid: {
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        borderLeft: '4px solid #45a049'
      },
      overdue: {
        background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
        borderLeft: '4px solid #d32f2f'
      },
      approved: {
        background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
        borderLeft: '4px solid #1976D2'
      }
    };

    return statusStyles[status] || statusStyles.pending;
  };

  const cardStyle = {
    ...getStatusStyles(),
    color: 'white',
    padding: '8px',
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '1.3',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'scale(1.02)';
    e.currentTarget.style.zIndex = '10';
    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.zIndex = '1';
    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  };

  return (
    <div 
      className={`expense-card expense-card--${status}`}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={`${title} - ${formatAmount(amount)} - ${participantList.length} participant(s)`}
    >
      {/* Main Content */}
      <div className="expense-card__content">
        {/* Title */}
        <div 
          className="expense-card__title"
          style={{ 
            fontWeight: 'bold',
            fontSize: '13px',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </div>

        {/* Amount */}
        <div 
          className="expense-card__amount"
          style={{ 
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '4px',
            background: 'rgba(255,255,255,0.2)',
            padding: '2px 6px',
            borderRadius: '8px',
            display: 'inline-block',
            backdropFilter: 'blur(4px)'
          }}
        >
          {formatAmount(amount)}
        </div>

        {/* Time Range */}
        {formatTimeRange() && (
          <div 
            className="expense-card__time"
            style={{ 
              fontSize: '10px',
              opacity: 0.9,
              background: 'rgba(0,0,0,0.2)',
              padding: '2px 4px',
              borderRadius: '4px',
              marginBottom: '4px',
              display: 'inline-block'
            }}
          >
            ⏰ {formatTimeRange()}
          </div>
        )}
      </div>

      {/* Footer with participants */}
      {participantList.length > 0 && (
        <div 
          className="expense-card__footer"
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '4px',
            paddingTop: '4px',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {/* Participant count */}
          <span 
            style={{ 
              fontSize: '10px', 
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            👥 {participantList.length}
          </span>

          {/* Participant avatars */}
          <div 
            className="expense-card__avatars"
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '-2px'
            }}
          >
            {participantList.slice(0, 3).map((participant, index) => (
              <div 
                key={participant.userID || index}
                className="expense-card__avatar"
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: profilePics[participant.userID] 
                    ? `url(${profilePics[participant.userID]}) center/cover`
                    : '#ccc',
                  border: '1px solid rgba(255,255,255,0.5)',
                  marginLeft: index > 0 ? '-4px' : '0',
                  zIndex: participantList.length - index
                }}
                title={participant.name || 'Unknown'}
              />
            ))}
            {participantList.length > 3 && (
              <div 
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  marginLeft: '-4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  fontWeight: 'bold'
                }}
                title={`+${participantList.length - 3} more`}
              >
                +{participantList.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div 
        className="expense-card__status"
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: status === 'paid' ? '#4CAF50' : 
                     status === 'overdue' ? '#f44336' : 
                     status === 'approved' ? '#2196F3' : '#ff9a56',
          boxShadow: '0 0 0 2px rgba(255,255,255,0.3)'
        }}
        title={`Status: ${status}`}
      />
    </div>
  );
};

export default ExpenseCard;