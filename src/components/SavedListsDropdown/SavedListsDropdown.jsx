import { useState, useRef, useEffect } from "react";
import "./SavedListsDropdown.css";

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
    <div ref={dropdownRef} className="dropdown-container">
      <div 
        onClick={toggleDropdown}
        className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
      >
        <span className={`dropdown-text ${selectedList ? 'selected' : ''}`}>
          {selectedList ? selectedList.name : placeholder}
        </span>
        <div className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div
            onClick={handleCreateNewList}
            className="dropdown-item create-new-item"
          >
            <div className="create-new-icon">+</div>
            Create New List
          </div>

          {savedLists.map((list, index) => (
            <div
              key={list.id}
              onClick={() => handleSelectList(list)}
              className="dropdown-item"
            >
              <div className="list-item-name">
                {list.name}
              </div>
              {list.description && (
                <div className="list-item-description">
                  {list.description}
                </div>
              )}
            </div>
          ))}

          {savedLists.length === 0 && (
            <div className="no-lists-message">
              No saved lists yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedListsDropdown;