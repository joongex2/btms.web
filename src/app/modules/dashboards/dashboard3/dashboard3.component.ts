import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

export type RadarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  colors: any[];
};

@Component({
  selector: 'dashboard3',
  templateUrl: './dashboard3.component.html',
  styleUrls: ['./dashboard3.component.scss']
})
export class Dashboard3Component implements OnInit {
  public radarChartOptions: Partial<RadarChartOptions>;
  public barChartOptions: Partial<BarChartOptions>;
  public barChart2Options: Partial<BarChartOptions>;

  // combo box options // mock
  bus = [
    { title: 'bu1', value: 'bu1' },
    { title: 'bu2', value: 'bu2' },
    { title: 'bu3', value: 'bu3' }
  ];

  plants = [
    { title: 'plant1', value: 'plant1' },
    { title: 'plant2', value: 'plant2' },
    { title: 'plant3', value: 'plant3' }
  ];

  // bind value
  selectedBu: string;
  selectedPlant: string;
  dateUpdate: any;
  today: any;

  mockData: any = [
    {
      name: 'AGRO',
      data: {
        radar: {
          totalKpi: [1.2, 1.5, 1, 0.8, 0.3, 0.8, 0.3, 0.2],
          criticalKpi: [0.2, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.2]
        },
        totalKpiTable: ['Action Plan 36', 'Close 25', 'Over due 5'],
        totalKpiBar: {
          data: [9, 2, 23, 2],
          categories: ["AHTB", "BIT", "Feed", "Other"]
        },
        criticalKpiTable: ['Action Plan 6', 'Close 5', 'Over due 2'],
        criticalKpiBar: {
          data: [1, 0, 4, 1],
          categories: ["AHTB", "BIT", "Feed", "Other"]
        }
      }
    },
    {
      name: 'PET',
      data: {
        radar: {
          totalKpi: [1.2, 1.5, 1, 0.8, 0.3, 0.8, 0.3, 0.2],
          criticalKpi: [0.2, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.2]
        },
        totalKpiTable: ['Action Plan 4', 'Close 3', 'Over due 1'],
        totalKpiBar: {
          data: [1],
          categories: ["PET"]
        },
        criticalKpiTable: ['Action Plan 6', 'Close 5', 'Over due 2'],
        criticalKpiBar: {
          data: [1],
          categories: ["PET"]
        }
      }
    },
    {
      name: 'Protein (Livestock)',
      data: {
        radar: {
          totalKpi: [1.2, 1.5, 1, 0.8, 0.3, 0.8, 0.3, 0.2],
          criticalKpi: [0.2, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.2]
        },
        totalKpiTable: ['Action Plan 20', 'Close 3', 'Over due 1'],
        totalKpiBar: {
          data: [6, 5, 3, 2, 4],
          categories: ["Breeder","Broilet Farm", "Hatchery", "Pullet&Layout", "ECC"]
        },
        criticalKpiTable: ['Action Plan 5', 'Close 4', 'Over due 1'],
        criticalKpiBar: {
          data: [0, 2, 1, 1, 1],
          categories: ["Breeder","Broilet Farm", "Hatchery", "Pullet&Layout", "ECC"]
        }
      }
    },
    {
      name: 'Protein (Factory)',
      data: {
        radar: {
          totalKpi: [1.2, 1.5, 1, 0.8, 0.3, 0.8, 0.3, 0.2],
          criticalKpi: [0.2, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.2]
        },
        totalKpiTable: ['Action Plan 36', 'Close 25', 'Over due 5'],
        totalKpiBar: {
          data: [25, 15, 12, 3],
          categories: ["PS", "SS", "FURTHER", "Other-PR"]
        },
        criticalKpiTable: ['Action Plan 5', 'Close 4', 'Over due 1'],
        criticalKpiBar: {
          data: [1, 0, 4, 1],
          categories: ["PS", "SS", "FURTHER", "Other-PR"]
        }
      }
    },
    {
      name: 'Food',
      data: {
        radar: {
          totalKpi: [1.2, 1.5, 1, 0.8, 0.3, 0.8, 0.3, 0.2],
          criticalKpi: [0.2, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.2]
        },
        totalKpiTable: ['Action Plan 36', 'Close 25', 'Over due 5'],
        totalKpiBar: {
          data: [26],
          categories: ["Food"]
        },
        criticalKpiTable: ['Action Plan 14', 'Close 10', 'Over due 8'],
        criticalKpiBar: {
          data: [14],
          categories: ["Food"]
        }
      }
    }
  ]

  constructor() {
    this.radarChartOptions = {
      series: [
        {
          name: "Total KPI",
          data: [1.2, 0.2, 0.3, 0.8, 0.3, 0.8, 1, 1.5]
        },
        {
          name: "Critical",
          data: [0.2, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.2]
        }
      ],
      chart: {
        height: 250,
        type: "radar"
      },
      xaxis: {
        categories: ["Productivity", "Quality", "Food", "Cost", "Delivery", "Morale", "Safety", "Environment"]
      },
      colors: ['#32CD32', '#FF0000']
    };

    this.barChartOptions = {
      series: [
        {
          name: "Total KPI",
          color: "#5A9BD5",
          data: [93, 92, 94, 91]
        }
      ],
      chart: {
        type: "bar",
        height: 150
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {},
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " %";
          }
        }
      }
    };

    this.barChart2Options = {
      series: [
        {
          name: "Total KPI",
          color: "#ED7D31",
          data: [93, 92, 94, 91]
        }
      ],
      chart: {
        type: "bar",
        height: 150
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {},
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " %";
          }
        }
      }
    };
  }

  parseMockData() {
    for (let data of this.mockData) {
      // radar
      data.data.radar.series = [
        {
          name: "Total KPI",
          data: data.data.radar.totalKpi
        },
        {
          name: "Critical KPI",
          data: data.data.radar.criticalKpi
        }
      ];
      // totalkpibarchart
      data.data.totalKpiBar.series = [{
        name: "Total KPI",
        color: "#5A9BD5",
        data: data.data.totalKpiBar.data
      }]
      data.data.totalKpiBar.xaxis = { ...this.barChartOptions.xaxis, categories: data.data.totalKpiBar.categories }
      // criticalkpibarchart
      data.data.criticalKpiBar.series = [
        {
          name: "Total KPI",
          color: "#ED7D31",
          data: data.data.criticalKpiBar.data
        }
      ]
      data.data.criticalKpiBar.xaxis = { ...this.barChart2Options.xaxis, categories: data.data.criticalKpiBar.categories }
    }

  }

  ngOnInit(): void {
    this.today = moment();
    this.parseMockData();
  }
}
