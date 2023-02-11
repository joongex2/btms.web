import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { DashboardService } from '../dashboard.service';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: any[];
};

export type RadarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
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

@Component({
  selector: 'dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard1Component implements OnInit, OnDestroy {
  @ViewChild("pieChart") pieChart: ChartComponent;
  @ViewChild("radarChart") radarChart: ChartComponent;
  @ViewChild("stackBarChart") stackBarChart: ChartComponent;
  @ViewChild("barChart") barChart: ChartComponent;
  @ViewChild("donutChart") donutChart: ChartComponent;
  @ViewChild("chart") chart: ChartComponent;
  public pieChartOptions: Partial<PieChartOptions>;
  public radarChartOptions: Partial<RadarChartOptions>;
  public stackBarChartOptions: Partial<StackBarChartOptions>;
  public barChartOptions: Partial<BarChartOptions>;
  public donutChartOptions: Partial<DonutChartOptions>;
  public gaugeChartOptions: Partial<GaugeChartOptions>;

  kpiDetails = {
    columns: ['kpi', 'number', 'result'],
    rows: [
      {
        id: 1,
        kpi: 'Send documents to pay for shipping',
        number: 7,
        result: 'A'
      },
      {
        id: 2,
        kpi: 'Send documents to pay for shipping',
        number: 1,
        result: 'U'
      },
      {
        id: 3,
        kpi: 'Delivery complaint',
        number: 4,
        result: 'A'
      },
      {
        id: 4,
        kpi: 'Delivery complaint',
        number: 4,
        result: 'U'
      },
      {
        id: 5,
        kpi: '%Delivery on time',
        number: 34,
        result: 'A'
      },
      {
        id: 6,
        kpi: '%Delivery on time',
        number: 20,
        result: 'U'
      }
    ]
  }

  /**
   * Constructor
   */
  constructor(
    private _dashboardService: DashboardService,
    private _router: Router
  ) {
    this.pieChartOptions = {
      series: [9.09, 90.91],
      chart: {
        width: 300,
        type: "pie"
      },
      labels: ["Food", "Agro"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 150
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      colors: ["#40E0D0", "#2E8B57"]
    };

    this.radarChartOptions = {
      series: [
        {
          name: "%Archive",
          data: [90, 70, 70, 70, 80, 80]
        },
        {
          name: "%Unarchive",
          data: [10, 30, 30, 30, 20, 20]
        }
      ],
      chart: {
        height: 350,
        type: "radar",
        width: "100%"
      },
      xaxis: {
        categories: ["SHE", "Cost&Control", "Manpower", "Protection", "Food Safety", "Delivery"]
      },
      colors: ['#32CD32', '#FF0000']
    };

    this.stackBarChartOptions = {
      series: [
        {
          name: "A",
          data: [80, 83, 86, 88]
        },
        {
          name: "U",
          data: [20, 17, 14, 12]
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%"
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: ['Food Processing', 'Swine Slauther', 'Poultry Slauther', 'BP']
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "K";
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40
      },
      colors: ['#32CD32', '#FF0000']
    };

    this.barChartOptions = {
      series: [
        {
          name: "%Archive",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }
      ],
      chart: {
        type: "bar",
        height: 140
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
          "Plant1",
          "Plant2",
          "Plant3",
          "Plant4",
          "Plant5",
          "Plant6",
          "Plant7",
          "Plant8",
          "Plant9"
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

    this.donutChartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: "donut",
        width: "100%"
      },
      labels: ["Food 1", "Food 2", "Food 3", "Food 4", "Food 5"],
      legend: {
        position: "bottom"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      colors: ["#40E0D0", "#2E8B57", "#2E8B90", "#2E8E90", "#2E8BF0", , "#2E8B1A"]
    };

    // setTimeout(() => this.donutChartOptions.chart.width = '100%', 100);

    this.gaugeChartOptions = {
      series: [67],
      chart: {
        height: 150,
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
      labels: [""],
      colors: ["#2E8B57"]
    };
  }

  ngOnInit(): void { }
  ngOnDestroy(): void { }
}
