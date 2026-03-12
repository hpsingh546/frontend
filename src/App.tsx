import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import { fetchStates, fetchDates } from './utils/api';
import { FilterState } from './types';
import './App.css';

const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activePage, setActivePage] = useState('dashboard');

  const [states, setStates] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    state: '',
    fromDate: '',
    toDate: '',
  });
  const [dateRange, setDateRange] = useState({ minDate: '', maxDate: '' });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load states on mount
  useEffect(() => {
    fetchStates().then(loaded => {
      setStates(loaded);
      if (loaded.length > 0) {
        setFilters(f => ({ ...f, state: loaded[0] }));
      }
    }).catch(console.error);
  }, []);

  // Load dates when state changes
  useEffect(() => {
    if (!filters.state) return;
    fetchDates(filters.state).then(({ minDate, maxDate }) => {
      setDateRange({ minDate, maxDate });
      setFilters(f => ({ ...f, fromDate: minDate, toDate: maxDate }));
    }).catch(console.error);
  }, [filters.state]);

  const handleStateChange = (state: string) => {
    setFilters(f => ({ ...f, state }));
  };

  const handleFromDateChange = (fromDate: string) => {
    setFilters(f => ({ ...f, fromDate }));
  };

  const handleToDateChange = (toDate: string) => {
    setFilters(f => ({ ...f, toDate }));
  };

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        theme={theme}
        onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        activePage={activePage}
        onPageChange={setActivePage}
      />

      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <TopBar
          states={states}
          selectedState={filters.state}
          fromDate={filters.fromDate}
          toDate={filters.toDate}
          minDate={dateRange.minDate}
          maxDate={dateRange.maxDate}
          onStateChange={handleStateChange}
          onFromDateChange={handleFromDateChange}
          onToDateChange={handleToDateChange}
          onMobileMenuToggle={() => setMobileSidebarOpen(o => !o)}
        />

        <main className="page-content">
          {activePage === 'dashboard' && filters.fromDate && (
            <Dashboard filters={filters} theme={theme} />
          )}
          {activePage !== 'dashboard' && (
            <div className="placeholder-page">
              <div className="placeholder-icon">🚧</div>
              <h2>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h2>
              <p>This section is under construction</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
