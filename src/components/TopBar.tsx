import React from 'react';
import './TopBar.css';

interface TopBarProps {
  states: string[];
  selectedState: string;
  fromDate: string;
  toDate: string;
  minDate: string;
  maxDate: string;
  onStateChange: (state: string) => void;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onMobileMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  states,
  selectedState,
  fromDate,
  toDate,
  minDate,
  maxDate,
  onStateChange,
  onFromDateChange,
  onToDateChange,
  onMobileMenuToggle,
}) => {
  return (
    <>
     <div className="topbar-home">
        <h1>Home User</h1>
      </div>
    <header className="topbar">
     
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMobileMenuToggle}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <span className="topbar-label">Sales Overview</span>
      </div>

      <div className="topbar-filters">
        {/* State Selector */}
        <div className="filter-group">
          <label className="filter-label">Select a state</label>
          <div className="select-wrapper">
            <select
              className="filter-select"
              value={selectedState}
              onChange={e => onStateChange(e.target.value)}
            >
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <svg className="select-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Date From */}
        <div className="filter-group">
          <label className="filter-label">Select From date</label>
          <div className="date-wrapper">
            <svg className="date-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M1 6h12M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              type="date"
              className="filter-date"
              value={fromDate}
              min={minDate}
              max={toDate}
              onChange={e => onFromDateChange(e.target.value)}
            />
          </div>
        </div>

        {/* Date To */}
        <div className="filter-group">
          <label className="filter-label">Select To date</label>
          <div className="date-wrapper">
            <svg className="date-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M1 6h12M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              type="date"
              className="filter-date"
              value={toDate}
              min={fromDate}
              max={maxDate}
              onChange={e => onToDateChange(e.target.value)}
            />
          </div>
        </div>
      </div>

    
    </header>
    </>
  );
};

export default TopBar;
