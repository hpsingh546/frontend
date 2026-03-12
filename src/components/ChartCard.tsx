import React from 'react';
import './ChartCard.css';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  loading?: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  action,
  loading = false,
}) => {
  return (
    <div className="chart-card fade-in">
      <div className="chart-card-header">
        <div>
          <h3 className="chart-card-title">{title}</h3>
          {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
        </div>
        {action && <div className="chart-card-action">{action}</div>}
      </div>
      <div className="chart-card-body">
        {loading ? (
          <div className="chart-loading">
            <div className="spinner" />
          </div>
        ) : children}
      </div>
    </div>
  );
};

export default ChartCard;
