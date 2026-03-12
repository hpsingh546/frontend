import React from 'react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  loading = false,
}) => {
  return (
    <div className="stat-card fade-in">
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-card-content">
        <div className="stat-title">{title}</div>
        {loading ? (
          <div className="stat-skeleton">
            <div className="skeleton-line" />
          </div>
        ) : (
          <div className="stat-value">{value}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
