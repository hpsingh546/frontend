export interface DashboardCards {
  totalSales: number;
  totalProfit: number;
  discountPercentage: number;
  totalQuantity: number;
  totalOrders: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface SalesOverTime {
  month: string;
  sales: number;
  profit: number;
}

export interface DashboardData {
  cards: DashboardCards;
  salesByCategory: ChartDataPoint[];
  salesBySubCategory: ChartDataPoint[];
  salesBySegment: ChartDataPoint[];
  salesOverTime: SalesOverTime[];
  topProducts: ChartDataPoint[];
  salesByCity: ChartDataPoint[];
  salesByProduct: ChartDataPoint[];
  profitBySubCategory: ChartDataPoint[];
  salesByRegion: ChartDataPoint[];
  salesByShipMode: ChartDataPoint[];
}

export interface DateRange {
  minDate: string;
  maxDate: string;
}

export interface FilterState {
  state: string;
  fromDate: string;
  toDate: string;
}
