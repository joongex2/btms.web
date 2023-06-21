import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { DashboardService } from '../dashboard.service';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: any[];
};

export type StackBarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
  colors: any[];
};

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

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  labels: any;
  colors: any[];
};

export type GaugeChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  colors: any[];
};

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
}

export type BarChart2Options = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard1Component implements OnInit, OnDestroy {
  public barChartOptions: Partial<BarChartOptions>;
  public gaugeChartOptions: Partial<GaugeChartOptions>;
  public areaChartOptions: Partial<AreaChartOptions>;
  public barChart2Options: Partial<BarChart2Options>;
  @Input() bus: any[] = [];
  @Input() plants: any[] = [];
  form: FormGroup;

  // combo box options
  years = [];

  months = [
    { title: 'Jan', value: 1 },
    { title: 'Feb', value: 2 },
    { title: 'Mar', value: 3 },
    { title: 'Apr', value: 4 },
    { title: 'May', value: 5 },
    { title: 'Jun', value: 6 },
    { title: 'Jul', value: 7 },
    { title: 'Aug', value: 8 },
    { title: 'Sep', value: 9 },
    { title: 'Oct', value: 10 },
    { title: 'Nov', value: 11 },
    { title: 'Dec', value: 12 }
  ];

  mockData1 = {
    totalKpi: {
      percent: 90,
      amount: 4500
    },
    criticalKpi: {
      percent: 99,
      amount: 200
    }
  };

  mockData2: any = [
    {
      name: "%A-SHE",
      data: {
        guage: {
          data: 92,
          labels: "2000 KPI"
        },
        areachart: {
          data: [90, 92, 97, 94, 93, 90, 80, 78, 99, 91, 86, 90]
        }
      }
    },
    {
      name: "%A-Quality",
      data: {
        guage: {
          data: 74,
          labels: "1000 KPI"
        },
        areachart: {
          data: [90, 92, 97, 94, 93, 90, 80, 78, 99, 91, 86, 90]
        }
      }
    },
    {
      name: "%A-Food Safety",
      data: {
        guage: {
          data: 78,
          labels: "1000 KPI"
        },
        areachart: {
          data: [90, 92, 97, 94, 93, 90, 80, 78, 99, 91, 86, 90]
        }
      }
    },
    {
      name: "%A-Cost",
      data: {
        guage: {
          data: 71,
          labels: "500 KPI"
        },
        areachart: {
          data: [90, 92, 97, 94, 93, 90, 80, 78, 99, 91, 86, 90]
        }
      }
    },
    {
      name: "%A-Delivery",
      data: {
        guage: {
          data: 68,
          labels: "1500 KPI"
        },
        areachart: {
          data: [90, 92, 97, 94, 93, 90, 80, 78, 99, 91, 86, 90]
        }
      }
    },
    {
      name: "%A-Morale",
      data: {
        guage: {
          data: 92,
          labels: "2000 KPI"
        },
        areachart: {
          data: [90, 92, 97, 94, 93, 90, 80, 78, 99, 91, 86, 90]
        }
      }
    },
    {
      name: "%A-Safety",
      data: {
        guage: {
          data: 76,
          labels: "200 KPI"
        },
        areachart: {
          data: [90, 92, 97, 94, 93, 90, 80, 78, 99, 91, 86, 90]
        }
      }
    },
    {
      name: "%A-Environment",
      data: {
        guage: {
          data: 74,
          labels: "200 KPI"
        },
        areachart: {
          data: [90, 92, 97, 94, 93, 90, 80, 78, 99, 91, 86, 90]
        }
      }
    }
  ];

  mockData3: any = {
    data: {
      totalKpi: [93, 92, 94, 91, 0, 0, 0, 0, 0, 0, 0, 0],
      criticalKpi: [98, 97, 97, 95, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  };

  mockData4: any = {
    data: [92, 95, 97, 99, 98],
    categories: ["Food", "Protein Livestock", "Protein Factory", "Pet", "Agro"]
  };

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _dashboardService: DashboardService,
    private _router: Router
  ) {
    // setTimeout(() => this.donutChartOptions.chart.width = '100%', 100);

    this.gaugeChartOptions = {
      chart: {
        height: 180,
        type: "radialBar",
        offsetY: -10
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: "16px",
              color: undefined,
              offsetY: 80
            },
            value: {
              offsetY: 40,
              fontSize: "16px",
              color: undefined,
              formatter: function (val) {
                return val + "%";
              }
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91]
        }
      },
      stroke: {
        dashArray: 4
      },
      colors: ["#2E8B57"]
    };

    this.areaChartOptions = {
      series: [
        {
          name: "STOCK ABC",
          data: [
            90,
            92,
            97,
            94,
            93,
            90,
            80,
            78,
            99,
            91,
            86,
            90
          ]
        }
      ],
      chart: {
        type: "area",
        height: 140,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },

      title: {
        text: "",
        align: "left"
      },
      subtitle: {
        text: "",
        align: "left"
      },
      labels: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
      ],
      xaxis: {
        type: "category",
        categories: [
          "1",
          "",
          "3",
          "",
          "5",
          "",
          "7",
          "",
          "9",
          "",
          "11",
          ""
        ],
        tickPlacement: 'on'
      },
      yaxis: {
        // opposite: true
        max: 100,
        tickAmount: 6
      },
      legend: {
        horizontalAlign: "left"
      }
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
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
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
      }
    };

    this.barChart2Options = {
      chart: {
        type: "bar",
        height: 200
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {}
    };
  }

  parseMockData() {
    for (let data of this.mockData2) {
      // guage
      data.data.guage.series = [data.data.guage.data]
      data.data.guage.labels = [data.data.guage.labels]

      // areachart
      data.data.areachart.series = [
        {
          name: "",
          data: data.data.areachart.data,
          color: "#5A9BD5"
        }
      ]
    }

    this.mockData3.series = [
      {
        name: "Total KPI",
        data: this.mockData3.data.totalKpi,
        color: "#92D051"
      },
      {
        name: "Critical KPI",
        data: this.mockData3.data.criticalKpi,
        color: "#06B050"
      }
    ];

    this.mockData4.series = [
      {
        name: "archieve",
        data: this.mockData4.data,
        color: "#5A9BD5"
      }
    ];

    this.mockData4.xaxis = { ...this.barChart2Options.xaxis, categories: this.mockData4.categories }
  }

  ngOnInit(): void {
    this.parseMockData();
    const today = moment();
    const currentMonth = today.month() + 1;
    const currentYear = today.year();
    for (let i = 0; i < 10; i++) {
      this.years.push({ title: (currentYear - i).toString(), value: currentYear - i })
    }
    this.form = this._formBuilder.group({
      month: currentMonth,
      year: currentYear,
      bus: null,
      plants: null
    });
    // select all
    this.form.get('bus').setValue(this.bus);
    this.form.get('plants').setValue(this.plants);
  }
  ngOnDestroy(): void { }
}
