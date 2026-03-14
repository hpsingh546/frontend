import { DashboardData, DateRange } from '../types';

const BASE_URL = 'http://localhost:5000/api';

export async function fetchStates(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/states`);
  if (!res.ok) throw new Error('Failed to fetch states');
  const data = await res.json();
  return data.states;
}

export async function fetchDates(state: string): Promise<DateRange> {
  const params = new URLSearchParams({ state });
  const res = await fetch(`${BASE_URL}/dates?${params}`);
  if (!res.ok) throw new Error('Failed to fetch dates');
  return res.json();
}

export async function fetchDashboard(
  state: string,
  from: string,
  to: string
): Promise<DashboardData> {
  const params = new URLSearchParams({ state, from, to });
  const res = await fetch(`${BASE_URL}/dashboard?${params}`);
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}
