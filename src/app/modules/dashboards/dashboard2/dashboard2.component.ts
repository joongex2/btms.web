import { Component, OnInit } from '@angular/core';
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

export type BarChart2Options = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
};

export type RadarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  colors: any[];
};

@Component({
  selector: 'dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss']
})
export class Dashboard2Component implements OnInit {
  public radarChartOptions: Partial<RadarChartOptions>;
  public barChartOptions: Partial<BarChartOptions>;
  public barChart2Options: Partial<BarChart2Options>;

  // combo box options // mock
  years = [
    { title: '2023', value: '2023' },
    { title: '2022', value: '2022' },
    { title: '2021', value: '2021' }
  ];

  months = [
    { title: 'Jan', value: '1' },
    { title: 'Feb', value: '2' },
    { title: 'Mar', value: '3' }
  ];

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
  selectedYear: string;
  selectedMonth: string;
  selectedBu: string;
  selectedPlant: string;

  mockData: any = [
    {
      name: 'AGRO',
      data: {
        radar: [
          {
            data: [99, 94, 80, 85, 83, 87, 76, 92]
          }
        ],
        barchart: {
          data: {
            totalKpi: [93, 92, 94, 91],
            criticalKpi: [98, 97, 97, 95]
          },
          categories: ["AHTB", "BIT", "Feed", "Other"]
        },
        barchart2: {
          data: {
            totalKpi: [80, 91, 90, 70, 85, 88, 55, 90, 89, 65],
            criticalKpi: [90, 95, 96, 97, 90, 88, 60, 70, 99, 50]
          },
          categories: ["EN", "EMM", "DP", "DL", "DE", "DC", "BOR", "BL", "ANTC", "AC"]
        }
      }
    },
    {
      name: 'PET',
      data: {
        radar: [
          {
            data: [99, 94, 80, 85, 83, 87, 76, 92]
          }
        ],
        barchart: {
          data: {
            totalKpi: [98],
            criticalKpi: [99]
          },
          categories: ["PET"]
        },
        barchart2: {
          data: {
            totalKpi: [80, 91, 90, 70, 85, 88, 55, 90, 89, 65],
            criticalKpi: [90, 95, 96, 97, 90, 88, 60, 70, 99, 50]
          },
          categories: ["EN", "EMM", "DP", "DL", "DE", "DC", "BOR", "BL", "ANTC", "AC"]
        }
      }
    },
    {
      name: 'Protein (Livestock)',
      data: {
        radar: [
          {
            data: [99, 94, 80, 85, 83, 87, 76, 92]
          }
        ],
        barchart: {
          data: {
            totalKpi: [93, 94, 92, 91],
            criticalKpi: [99, 98, 93, 95]
          },
          categories: ["Breeder","Broilet Farm", "Hatchery", "Pullet&Layout"]
        },
        barchart2: {
          data: {
            totalKpi: [80, 91, 90, 70, 85, 88, 55, 90, 89, 65],
            criticalKpi: [90, 95, 96, 97, 90, 88, 60, 70, 99, 50]
          },
          categories: ["EN", "EMM", "DP", "DL", "DE", "DC", "BOR", "BL", "ANTC", "AC"]
        }
      }
    },
    {
      name: 'Protein (Factory)',
      data: {
        radar: [
          {
            data: [99, 94, 80, 85, 83, 87, 76, 92]
          }
        ],
        barchart: {
          data: {
            totalKpi: [98, 97, 99, 93],
            criticalKpi: [99, 99, 100, 97]
          },
          categories: ["PS", "SS", "FURTHER", "Other-PR"]
        },
        barchart2: {
          data: {
            totalKpi: [80, 91, 90, 70, 85, 88, 55, 90, 89, 65],
            criticalKpi: [90, 95, 96, 97, 90, 88, 60, 70, 99, 50]
          },
          categories: ["EN", "EMM", "DP", "DL", "DE", "DC", "BOR", "BL", "ANTC", "AC"]
        }
      }
    },
    {
      name: 'Food',
      data: {
        radar: [
          {
            data: [99, 94, 80, 85, 83, 87, 76, 92]
          }
        ],
        barchart: {
          data: {
            totalKpi: [98],
            criticalKpi: [99]
          },
          categories: ["Food"]
        },
        barchart2: {
          data: {
            totalKpi: [80, 91, 90, 70, 85, 88, 55, 90, 89, 65],
            criticalKpi: [90, 95, 96, 97, 90, 88, 60, 70, 99, 50]
          },
          categories: ["EN", "EMM", "DP", "DL", "DE", "DC", "BOR", "BL", "ANTC", "AC"]
        }
      }
    }
  ]

  constructor() {
    this.radarChartOptions = {
      chart: {
        height: 250,
        type: "radar"
      },
      xaxis: {
        categories: ["Productivity", "Quality", "Food Safety", "Cost", "Delivery", "Morale", "Safety", "Environment"]
      },
      colors: ['#A7FF9B']
    };

    this.barChartOptions = {
      chart: {
        type: "bar",
        height: 200
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
      xaxis: {
        categories: [
          "AHTB",
          "BIT",
          "Feed",
          "Other"
        ]
      },
      yaxis: {
        title: {
          text: "%"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " %";
          }
        }
      },
      legend: {
        show: false
      }
    };

    this.barChart2Options = {
      chart: {
        type: "bar",
        height: 300
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"]
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {}
    };
  }

  parseMockData() {
    for (let data of this.mockData) {
      // barchart1
      data.data.barchart.series = [{
        name: "Total KPI",
        color: "#5A9BD5",
        data: data.data.barchart.data.totalKpi
      },
      {
        name: "Critical KPI",
        color: "#ED7D31",
        data: data.data.barchart.data.criticalKpi
      }
      ]
      data.data.barchart.xaxis = { ...this.barChartOptions.xaxis, categories: data.data.barchart.categories }
      // barchart2
      data.data.barchart2.series = [
        {
          name: "Total KPI",
          color: "#5A9BD5",
          data: data.data.barchart2.data.totalKpi
        },
        {
          name: "Critical KPI",
          color: "#ED7D31",
          data: data.data.barchart2.data.criticalKpi
        }
      ]
      data.data.barchart2.xaxis = { ...this.barChart2Options.xaxis, categories: data.data.barchart2.categories }
    }

  }

  ngOnInit(): void {
    this.parseMockData();
  }
}
