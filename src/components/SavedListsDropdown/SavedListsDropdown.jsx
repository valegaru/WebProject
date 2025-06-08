import { useState, useRef, useEffect } from "react";

const SavedListsDropdown = ({ savedLists = [], onCreateNewList, onSelectList, placeholder = "Select a list..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateNewList = () => {
    setIsOpen(false);
    onCreateNewList();
  };

  const handleSelectList = (list) => {
    setSelectedList(list);
    setIsOpen(false);
    onSelectList(list);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      ref={dropdownRef}
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      <div 
        onClick={toggleDropdown}
        style={{
          width: '100%',
          padding: '12px 45px 12px 15px',
          fontSize: '16px',
          border: '2px solid #e0e0e0',
          borderRadius: '25px',
          outline: 'none',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          backgroundColor: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#007bff';
          e.target.style.boxShadow = '0 4px 15px rgba(0,123,255,0.2)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.target.style.borderColor = '#e0e0e0';
            e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
          }
        }}
      >
        <span style={{ 
          color: selectedList ? '#333' : '#666',
          fontWeight: selectedList ? '500' : 'normal'
        }}>
          {selectedList ? selectedList.name : placeholder}
        </span>
        <div style={{
          color: '#666',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          marginTop: '5px',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 1001
        }}>
          <div
            onClick={handleCreateNewList}
            style={{
              padding: '12px 15px',
              cursor: 'pointer',
              borderBottom: savedLists.length > 0 ? '1px solid #f0f0f0' : 'none',
              transition: 'background-color 0.2s ease',
              fontSize: '14px',
              lineHeight: '1.4',
              display: 'flex',
              alignItems: 'center',
              fontWeight: '500',
              color: '#007bff'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
            }}
          >
            <div style={{
              marginRight: '8px',
              fontSize: '16px'
            }}>
              +
            </div>
            Create New List
          </div>

          {savedLists.map((list, index) => (
            <div
              key={list.id}
              onClick={() => handleSelectList(list)}
              style={{
                padding: '12px 15px',
                cursor: 'pointer',
                borderBottom: index < savedLists.length - 1 ? '1px solid #f0f0f0' : 'none',
                transition: 'background-color 0.2s ease',
                fontSize: '14px',
                lineHeight: '1.4'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
              }}
            >
              <div style={{ fontWeight: '500', color: '#333' }}>
                {list.name}
              </div>
              {list.description && (
                <div style={{ color: '#666', fontSize: '12px', marginTop: '2px' }}>
                  {list.description}
                </div>
              )}
            </div>
          ))}

          {savedLists.length === 0 && (
            <div style={{
              padding: '12px 15px',
              color: '#666',
              fontSize: '14px',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              No saved lists yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedListsDropdown;