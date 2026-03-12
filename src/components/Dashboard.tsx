import React, { useEffect, useState, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { fetchDashboard, formatCurrency, formatNumber } from '../utils/api';
import { DashboardData, FilterState } from '../types';
import './Dashboard.css';

interface DashboardProps {
  filters: FilterState;
  theme: 'dark' | 'light';
}

const COLORS = ['#4f8ef7', '#f87171', '#fbbf24'];

const Dashboard: React.FC<DashboardProps> = ({ filters, theme }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const textColor = theme === 'dark' ? '#8892a4' : '#4a5568';
  const gridColor = theme === 'dark' ? '#2a3248' : '#e2e8f0';
  const tooltipBg = theme === 'dark' ? '#1c2333' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#2a3248' : '#e2e8f0';

  const loadData = useCallback(async () => {
    if (!filters.state || !filters.fromDate || !filters.toDate) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDashboard(filters.state, filters.fromDate, filters.toDate);
     console.log(result)
      setData(result);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [filters.state, filters.fromDate, filters.toDate]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Chart Options ──────────────────────────────────────────────────────────

  const salesOverTimeOption = () => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: theme === 'dark' ? '#e8eaf0' : '#1a202c', fontSize: 12 },
      formatter: (params: any[]) =>
        `<b>${params[0].name}</b><br/>` +
        params.map((p: any) => `${p.marker} ${p.seriesName}: ${formatCurrency(p.value)}`).join('<br/>'),
    },
    legend: {
      data: ['Sales', 'Profit'],
      textStyle: { color: textColor, fontSize: 12 },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      right: 0,
      top: 0,
    },
    grid: { left: 12, right: 12, top: 36, bottom: 0, containLabel: true },
    xAxis: {
      type: 'category',
      data: data?.salesOverTime.map(d => d.month) || [],
      axisLabel: { color: textColor, fontSize: 11, rotate: 30 },
      axisLine: { lineStyle: { color: gridColor } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: textColor, fontSize: 11, formatter: (v: number) => formatCurrency(v) },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
      axisLine: { show: false },
    },
    series: [
      {
        name: 'Sales',
        type: 'line',
        data: data?.salesOverTime.map(d => d.sales) || [],
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#4f8ef7', width: 2.5 },
        itemStyle: { color: '#4f8ef7' },
        areaStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
            { offset: 0, color: 'rgba(79,142,247,0.3)' },
            { offset: 1, color: 'rgba(79,142,247,0.02)' },
          ]},
        },
      },
      {
        name: 'Profit',
        type: 'line',
        data: data?.salesOverTime.map(d => d.profit) || [],
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#2dd4bf', width: 2.5 },
        itemStyle: { color: '#2dd4bf' },
        areaStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
            { offset: 0, color: 'rgba(45,212,191,0.2)' },
            { offset: 1, color: 'rgba(45,212,191,0.02)' },
          ]},
        },
      },
    ],
  });

  const categoryDonutOption = () => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: theme === 'dark' ? '#e8eaf0' : '#1a202c', fontSize: 12 },
      formatter: (p: any) => `${p.name}<br/>${formatCurrency(p.value)} (${p.percent}%)`,
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      textStyle: { color: textColor, fontSize: 12 },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [{
      type: 'pie',
      radius: ['45%', '72%'],
      center: ['38%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      emphasis: { label: { show: false } },
      data: (data?.salesByCategory || []).map((d, i) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: COLORS[i % COLORS.length] },
      })),
    }],
  });


   const salesByproduct = () => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: theme === 'dark' ? '#e8eaf0' : '#1a202c', fontSize: 12 },
      formatter: (params: any[]) => `${params[0].name}: ${formatCurrency(params[0].value)}`,
    axisPointer: { type: 'shadow' }, // Changed to shadow for a better hover effect
    },
    grid: { left: '3%', 
    right: '8%', 
    top: '5%', 
    bottom: '5%', 
    containLabel: true},
    xAxis: {
      type: 'value',
     axisLabel: { color: '#999', fontSize: 10 }, 
    splitLine: { 
      show: true,
      lineStyle: { color: '#e0e0e0', type: 'solid' } // Solid light lines like the image
    },
    axisLine: { show: false },
    axisTick: { show: false },
    },
    yAxis: {
      type: 'category',
      data: (data?.salesByProduct || []).map(d => d.name).reverse(),
     axisLabel: { 
      color: '#666', 
      fontSize: 11,
      margin: 15 // Gives the labels some breathing room
    },
    axisLine: { show: false },
    axisTick: { show: false },
    },
    series: [{
      type: 'bar',
      data: (data?.salesByProduct || []).map((d, i) => ({
        value: d.value,
        itemStyle: {
          color: '#92cedd', 
      borderRadius: [0, 0, 0, 0], // Image uses square bars
        },
      })).reverse(),
      barMaxWidth:'60%',
     
    }],
  });

  const salesByCity = () => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: tooltipBg,
    borderColor: tooltipBorder,
    textStyle: { color: theme === 'dark' ? '#e8eaf0' : '#1a202c', fontSize: 12 },
    // Simplified formatter to match the clean UI
    formatter: (params: any[]) => `${params[0].name}: ${formatCurrency(params[0].value)}`,
    axisPointer: { type: 'shadow' }, // Changed to shadow for a better hover effect
  },
  grid: { 
    left: '3%', 
    right: '8%', 
    top: '5%', 
    bottom: '5%', 
    containLabel: true 
  },
  xAxis: {
    type: 'value',
    // The image uses simple numbers/increments on the X-axis
    axisLabel: { color: '#999', fontSize: 10 }, 
    splitLine: { 
      show: true,
      lineStyle: { color: '#e0e0e0', type: 'solid' } // Solid light lines like the image
    },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'category',
    data: (data?.salesByCity || []).map(d => d.name).reverse(),
    axisLabel: { 
      color: '#666', 
      fontSize: 11,
      margin: 15 // Gives the labels some breathing room
    },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  series: [{
    type: 'bar',
    // Using the specific light blue/teal color from the dashboard
    itemStyle: {
      color: '#92cedd', 
      borderRadius: [0, 0, 0, 0], // Image uses square bars
    },
    barWidth: '60%', // Matches the visual weight in the image
    data: (data?.salesByCity || []).map(d => d.value).reverse(),
    label: {
      show: false, // The image doesn't show values on the bars, only on the axis
    },
  }],
});
  const salesBySubCategory = () => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: tooltipBg,
    borderColor: tooltipBorder,
    textStyle: { color: theme === 'dark' ? '#e8eaf0' : '#1a202c', fontSize: 12 },
    // Simplified formatter to match the clean UI
    formatter: (params: any[]) => `${params[0].name}: ${formatCurrency(params[0].value)}`,
    axisPointer: { type: 'shadow' }, // Changed to shadow for a better hover effect
  },
  grid: { 
    left: '3%', 
    right: '8%', 
    top: '5%', 
    bottom: '5%', 
    containLabel: true 
  },
  xAxis: {
    type: 'value',
    // The image uses simple numbers/increments on the X-axis
    axisLabel: { color: '#999', fontSize: 10 }, 
    splitLine: { 
      show: true,
      lineStyle: { color: '#e0e0e0', type: 'solid' } // Solid light lines like the image
    },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'category',
    data: (data?.salesBySubCategory || []).map(d => d.name).reverse(),
    axisLabel: { 
      color: '#666', 
      fontSize: 11,
      margin: 15 // Gives the labels some breathing room
    },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  series: [{
    type: 'bar',
    // Using the specific light blue/teal color from the dashboard
    itemStyle: {
      color: '#92cedd', 
      borderRadius: [0, 0, 0, 0], // Image uses square bars
    },
    barWidth: '60%', // Matches the visual weight in the image
    data: (data?.salesBySubCategory || []).map(d => d.value).reverse(),
    label: {
      show: false, // The image doesn't show values on the bars, only on the axis
    },
  }],
});

 
  const segmentBarOption = () => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: theme === 'dark' ? '#e8eaf0' : '#1a202c', fontSize: 12 },
      formatter: (params: any[]) =>
        `${params[0].name}<br/>${formatCurrency(params[0].value)}`,
    },
    grid: { left: 12, right: 12, top: 8, bottom: 0, containLabel: true },
    xAxis: {
      type: 'category',
      data: (data?.salesBySegment || []).map(d => d.name),
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: gridColor } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: textColor, fontSize: 11, formatter: (v: number) => formatCurrency(v) },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
      axisLine: { show: false },
    },
    series: [{
      type: 'bar',
      data: (data?.salesBySegment || []).map((d, i) => ({
        value: d.value,
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: COLORS[i % COLORS.length] },
              { offset: 1, color: COLORS[i % COLORS.length] + '60' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      })),
      barMaxWidth: 40,
    }],
  });

  const salesByCategory = () => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: theme === 'dark' ? '#e8eaf0' : '#1a202c', fontSize: 12 },
      formatter: (p: any) => `${p.name}<br/>${formatCurrency(p.value)} (${p.percent}%)`,
    },
    legend: {
      bottom: 0,
      textStyle: { color: textColor, fontSize: 11 },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [{
      type: 'pie',
      radius: ['30%', '60%'],
      center: ['50%', '42%'],
      label: { show: false },
      data: (data?.salesByCategory || []).map((d, i) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: COLORS[i % COLORS.length] },
      })),
    }],
  });
  const salesBySegment = () => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: theme === 'dark' ? '#e8eaf0' : '#1a202c', fontSize: 12 },
      formatter: (p: any) => `${p.name}<br/>${formatCurrency(p.value)} (${p.percent}%)`,
    },
    legend: {
      bottom: 0,
      textStyle: { color: textColor, fontSize: 11 },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [{
      type: 'pie',
      radius: ['30%', '60%'],
      center: ['50%', '42%'],
      label: { show: false },
      data: (data?.salesBySegment || []).map((d, i) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: COLORS[i % COLORS.length] },
      })),
    }],
  });

  const subCategoryOption = () => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: theme === 'dark' ? '#e8eaf0' : '#1a202c', fontSize: 12 },
      formatter: (params: any[]) =>
        `${params[0].name}<br/>${formatCurrency(params[0].value)}`,
    },
    grid: { left: 12, right: 16, top: 8, bottom: 0, containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: textColor, fontSize: 10, formatter: (v: number) => formatCurrency(v) },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: (data?.profitBySubCategory || []).map(d => d.name),
      axisLabel: { color: textColor, fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [{
      type: 'bar',
      data: (data?.profitBySubCategory || []).map(d => ({
        value: d.value,
        itemStyle: {
          color: d.value >= 0 ? '#34d399' : '#f87171',
          borderRadius: d.value >= 0 ? [0, 4, 4, 0] : [4, 0, 0, 4],
        },
      })),
      barMaxWidth: 14,
    }],
  });

  const shipModeOption = () => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: theme === 'dark' ? '#e8eaf0' : '#1a202c', fontSize: 12 },
      formatter: (p: any) => `${p.name}<br/>${formatCurrency(p.value)} (${p.percent}%)`,
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      textStyle: { color: textColor, fontSize: 11 },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [{
      type: 'pie',
      radius: '65%',
      center: ['38%', '50%'],
      label: { show: false },
      data: (data?.salesByShipMode || []).map((d, i) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: COLORS[i % COLORS.length] },
      })),
    }],
  });

  if (error) {
    return (
      <div className="dashboard-error">
        <div>⚠️ {error}</div>
        <button onClick={loadData} className="retry-btn">Retry</button>
      </div>
    );
  }

  const cards = data?.cards;

  return (
    <div className="dashboard">
      {/* Header */}
     

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Sales"
          value={loading ? '—' : formatCurrency(cards?.totalSales || 0)}
          icon={""}
          loading={loading}
        />
        <StatCard
          title="Quantity Sold"
          value={loading ? '—' : formatNumber(cards?.totalQuantity || 0)}
          icon={""}
          loading={loading}
        />
        <StatCard
          title="Discount %"
          value={loading ? '—' : formatNumber(cards?.discountPercentage || 0)}
          icon={""}
          loading={loading}
        />
        <StatCard
          title="Profit"
          value={loading ? '—' : formatCurrency(cards?.totalProfit || 0)}
          icon={""}
          loading={loading}
        />
      </div>

      {/* Sales Over Time */}
      <div className="charts-grid">
        
         <ChartCard
          title="Sales By City"
          subtitle=""
          loading={loading}
        >
          <ReactECharts option={salesByCity()} style={{ height: 220 }} />
        </ChartCard>

         <ChartCard
          title="Sales By Products"
          subtitle="Products Name"
          loading={loading}
        >
          <ReactECharts option={salesByproduct()} style={{ height: 220 }} />
        </ChartCard>
      </div>

      {/* Middle Row */}
      <div className="charts-grid-3">
        
        
         <ChartCard
          title="Sales by Category"
          subtitle=""
          loading={loading}
        >
          <ReactECharts option={salesByCategory()} style={{ height: 220 }} />
        </ChartCard>
        <ChartCard
          title="Sales by Sub-Category"
          subtitle="Sub-Category"
          loading={loading}
        >
          <ReactECharts option={salesBySubCategory()} style={{ height: 220 }} />
        </ChartCard>
        <ChartCard
          title="Sales by Segment"
          subtitle=""
          loading={loading}
        >
          <ReactECharts option={salesBySegment()} style={{ height: 220 }} />
        </ChartCard>

       
      </div>     
    </div>
  );
};

export default Dashboard;
