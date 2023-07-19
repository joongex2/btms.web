import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexXAxis } from 'ng-apexcharts';

// dashboard 1
export interface QualityManagementPerformance {
    achieve: Achieve;
    achieveAndTrendGroupByKpiType: AchieveAndTrendGroupByKpiType[];
    achieveByMonth: AchieveByMonth;
    achieveByBU: AchieveByBU;
}

export interface Achieve {
    totalKpi: {
        percent: number;
        amount: number;
    };
    criticalKpi: {
        percent: number;
        amount: number;
    };
}

export interface AchieveAndTrendGroupByKpiType {
    name: string;
    data: {
        guage: {
            data: number;
            labels: string;
        };
        areaChart: {
            data: number[];
        };
    };
}

export interface AchieveByMonth {
    data: {
        totalKpi: number[];
        criticalKpi: number[];
    };
}

export interface AchieveByBU {
    data: number[];
    categories: string[];
}

export interface AchieveChart {
    totalKpi: {
        percent: number;
        amount: number;
    };
    criticalKpi: {
        percent: number;
        amount: number;
    };
}

export interface AchieveAndTrendGroupByKpiTypeChart {
    name: string;
    guage: {
        series: ApexNonAxisChartSeries;
        labels: string[];
    };
    areachart: {
        series: ApexAxisChartSeries;
    };
}

export interface AchieveByMonthChart {
    series: ApexAxisChartSeries;
}

export interface AchieveByBUChart {
    series: ApexAxisChartSeries;
    xaxis: ApexXAxis;
}

// dashboard 2
export interface QualityManagementPerformanceByBu {
    name: string;
    data: {
        radar: number[];
        barchart: {
            data: {
                totalKpi: number[];
                criticalKpi: number[];
            };
            categories: string[];
        };
        barchart2: {
            data: {
                totalKpi: number[];
                criticalKpi: number[];
            };
            categories: string[];
        };
    };
}

export interface QualityManagementPerformanceByBuChart {
    name: string;
    data: {
        radar: ApexAxisChartSeries;
        barchart: {
            series: ApexAxisChartSeries;
            xaxis: ApexXAxis;
        };
        barchart2: {
            series: ApexAxisChartSeries;
            xaxis: ApexXAxis;
        };
    };
}

// dashboard 3
export interface ActionPlanStatus {
    name: string;
    data: {
        radar: {
            data: { name: string; data: number[] }[];
            categories: string[];
        };
        totalKpiTable: { name: string; value: number }[];
        totalKpiBar: {
            data: number[];
            categories: string[];
        };
        criticalKpiTable: { name: string; value: number }[];
        criticalKpiBar: {
            data: number[];
            categories: string[];
        };
    };
}

export interface ActionPlanStatusChart {
    name: string;
    data: {
        radar: {
            series: ApexAxisChartSeries;
            xaxis: ApexXAxis;
        };
        totalKpiTable: { name: string; value: number }[];
        totalKpiBar: {
            series: ApexAxisChartSeries;
            xaxis: ApexXAxis;
        };
        criticalKpiTable: { name: string; value: number }[];
        criticalKpiBar: {
            series: ApexAxisChartSeries;
            xaxis: ApexXAxis;
        };
    };
}
