import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  activePage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: '⊞', label: 'Sales Overview' },
  { id: 'store', icon: '📦', label: 'stores' },
  { id: 'Notification', icon: '🏷️', label: 'Notifications' },
  { id: 'settings', icon: '👥', label: 'settings' },
];



const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  theme,
  onThemeToggle,
  activePage,
  onPageChange,
}) => {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${theme}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        {!collapsed && <span className="logo-text">Sales Dashboard</span>}
        <button className="toggle-btn" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {collapsed ? (
              <path d="M5 3l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            ) : (
              <path d="M11 3L5 8l6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </svg>
        </button>
      </div>

      {/* Main Nav */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {!collapsed && activePage === item.id && <span className="nav-dot" />}
          </button>
        ))}
          <button className="nav-item theme-toggle" onClick={onThemeToggle} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          <span className="nav-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          {!collapsed && <span className="nav-label">{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>}
        </button>
      </nav>
      
    </aside>
  );
};

export default Sidebar;
