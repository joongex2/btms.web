/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { AchieveAndTrendGroupByKpiTypeChart, AchieveByBUChart, AchieveByMonthChart, AchieveChart, QualityManagementPerformance } from '../dashboard.interfaces';
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
};

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
  styleUrls: ['./dashboard1.component.scss']
})
export class Dashboard1Component implements OnInit, OnChanges, OnDestroy {
  @Input() bus: any[] = [];
  @Input() subBus: any[] = [];
  @Input() plants: any[] = [];
  public barChartOptions: Partial<BarChartOptions>;
  public gaugeChartOptions: Partial<GaugeChartOptions>;
  public areaChartOptions: Partial<AreaChartOptions>;
  public barChart2Options: Partial<BarChart2Options>;
  filteredPlants: any[] = [];
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

  // bind value
  achieveChart: AchieveChart;
  achieveAndTrendGroupByKpiTypeCharts: AchieveAndTrendGroupByKpiTypeChart[];
  achieveByMonthChart: AchieveByMonthChart;
  achieveByBUChart: AchieveByBUChart;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _dashboardService: DashboardService,
    private _router: Router,
    private _cdr: ChangeDetectorRef
  ) {
    this.gaugeChartOptions = {
      chart: {
        height: 180,
        type: 'radialBar',
        offsetY: -10
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: '16px',
              color: undefined,
              offsetY: 0
            },
            value: {
              offsetY: 5,
              fontSize: '12px',
              color: undefined,
              formatter: function (val) {
                return val + '%';
              }
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
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
      colors: ['#2E8B57']
    };

    this.areaChartOptions = {
      series: [
        {
          name: 'STOCK ABC',
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
        type: 'area',
        height: 200,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },

      title: {
        text: '',
        align: 'left'
      },
      subtitle: {
        text: '',
        align: 'left'
      },
      labels: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12'
      ],
      xaxis: {
        type: 'category',
        categories: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12'
        ],
        tickPlacement: 'on',
        tickAmount: 6
      },
      yaxis: {
        // opposite: true
        max: 100,
        tickAmount: 5,
        decimalsInFloat: 0
      },
      legend: {
        horizontalAlign: 'left'
      }
    };

    this.barChartOptions = {
      chart: {
        type: 'bar',
        height: 200
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]
      },
      yaxis: {
        max: 100,
        min: 0,
        tickAmount: 10,
        // title: {
        //   text: '%'
        // }
        decimalsInFloat: 0
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ' %';
          }
        }
      }
    };

    this.barChart2Options = {
      chart: {
        type: 'bar',
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
      xaxis: { }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.plants) {
      this.filteredPlants = [];
    }
  }

  ngOnInit(): void {
    const today = moment();
    const currentMonth = today.month() + 1;
    const currentYear = today.year();
    for (let i = 0; i < 10; i++) {
      this.years.push({ title: (currentYear - i).toString(), value: currentYear - i });
    }
    this.form = this._formBuilder.group({
      month: currentMonth,
      year: currentYear,
      bus: null,
      plants: null
    });

    this.initForm();
  }

  ngOnDestroy(): void { }

  async initForm(): Promise<void> {
    // select all
    this.form.get('bus').setValue(this.bus);
    await this.filterPlants();
    this.form.get('plants').setValue(this.filteredPlants);
    this.form.get('bus').valueChanges.subscribe((v) => {
      if (v.length === 0) { this.form.get('plants').disable(); }
    });
    this.refresh();
  }

  refresh(): void {
    const bus = this.form.get('bus').value?.map(v => v.value);
    const plants = this.form.get('plants').value?.map(v => v.value);
    this._dashboardService.qualityManagementPerformance(
      this.form.get('year').value,
      this.form.get('month').value,
      bus,
      plants
    ).subscribe((v) => {
      this.parseQualityManagementPerformance(v);
      this._cdr.detectChanges();
    });
  }

  async selectedBusChange(): Promise<void> {
    // reload plants
    await this.filterPlants();
    this.form.get('plants').reset();
  }

  filterPlants(): Promise<boolean> {
    return new Promise((res, rej) => {
      setTimeout(() => {
        const buCodes = this.form.get('bus').value.map(v => v.value);
        const buIds = this.bus.filter(v => buCodes.includes(v.value)).map(v => v.id);
        const filteredSubBuIds = this.subBus.filter(v => buIds.includes(v.parentId)).map(v => v.id);
        this.filteredPlants = this.plants.filter(v => filteredSubBuIds.includes(v.parentId));
        res(true);
      });
    });
  }

  parseQualityManagementPerformance(res: QualityManagementPerformance): void {
    this.achieveChart = res.achieve;

    this.achieveAndTrendGroupByKpiTypeCharts = [];
    for (const data of res.achieveAndTrendGroupByKpiType) {
      const achieveAndTrendGroupByKpiTypeChart: AchieveAndTrendGroupByKpiTypeChart = {
        name: data.name,
        guage: {
          series: [data.data.guage.data],
          labels: [data.data.guage.labels]
        },
        areachart: {
          series: [{
            name: '',
            data: data.data.areaChart.data,
            color: '#5A9BD5'
          }]
        }
      };
      this.achieveAndTrendGroupByKpiTypeCharts.push(achieveAndTrendGroupByKpiTypeChart);
    }

    this.achieveByMonthChart = {
      series: [
        {
          name: 'Total KPI',
          data: res.achieveByMonth.data.totalKpi,
          color: '#92D051'
        },
        {
          name: 'Critical KPI',
          data: res.achieveByMonth.data.criticalKpi,
          color: '#06B050'
        }
      ],
      xaxis: { categories: res.achieveByMonth.xaxis, max: 100}
    };

    this.achieveByBUChart = {
      series: [
        {
          name: 'achieve',
          data: res.achieveByBU.data,
          color: '#5A9BD5'
        }
      ],
      xaxis: { ...this.barChart2Options.xaxis, categories: res.achieveByBU.categories, max: 100 }
    };
  }
}

////xaxis: { ...res.achieveByBU.xaxis, categories: res.achieveByBU.categories }
