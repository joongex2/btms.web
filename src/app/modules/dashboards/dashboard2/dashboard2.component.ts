/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { QualityManagementPerformanceByBu, QualityManagementPerformanceByBuChart } from '../dashboard.interfaces';
import { DashboardService } from '../dashboard.service';

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
  yaxis: ApexYAxis;
  colors: any[];
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss']
})
export class Dashboard2Component implements OnInit, OnChanges {
  @Input() bus: any[] = [];
  @Input() subBus: any[] = [];
  @Input() plants: any[] = [];
  public radarChartOptions: Partial<RadarChartOptions>;
  public barChartOptions: Partial<BarChartOptions>;
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

  qualityManagementPerformanceByBuCharts: QualityManagementPerformanceByBuChart[];

  constructor(
    private _formBuilder: FormBuilder,
    private _dashboardService: DashboardService,
    private _cdr: ChangeDetectorRef
  ) {
    this.radarChartOptions = {
      chart: {
        height: 250,
        type: 'radar'
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
        decimalsInFloat: 0
      },
      colors: ['#A7FF9B'],
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '8px',
          colors: ['#000']
        },
        background: {
          enabled: false
        }
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
        enabled: true,
        style: {
          colors: ['#000']
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [
          'AHTB',
          'BIT',
          'Feed',
          'Other'
        ]
      },
      yaxis: {
        title: {
          text: '%'
        },
        max: 100,
        tickAmount: 5,
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
      },
      legend: {
        show: false
      }
    };

    this.barChart2Options = {
      chart: {
        type: 'bar',
        height: 400
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#000']
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
      },
      xaxis: {
        max: 100,
        tickAmount: 5,
        decimalsInFloat: 0
      }
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
    this._dashboardService.qualityManagementPerformanceByBu(
      this.form.get('year').value,
      this.form.get('month').value,
      bus,
      plants
    ).subscribe((v) => {
      this.parseQualityManagementPerformanceByBu(v);
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

  parseQualityManagementPerformanceByBu(res: QualityManagementPerformanceByBu[]): void {
    this.qualityManagementPerformanceByBuCharts = [];
    for (const data of res) {
      const qualityManagementPerformanceByBuChart: QualityManagementPerformanceByBuChart = {
        name: data.name,
        data: {
          radar: {
            series: [{ data: data.data.radar.data }],
            xaxis: { ...this.radarChartOptions.xaxis, categories: data.data.radar.categories, labels: { show: true, style: { fontSize: '12px', fontWeight: 600, colors: data.data.radar.categories.map(v => '#000') } } }
          },
          barchart: {
            series: [
              {
                name: 'Total KPI',
                color: '#5A9BD5',
                data: data.data.barchart.data.totalKpi
              },
              {
                name: 'Critical KPI',
                color: '#ED7D31',
                data: data.data.barchart.data.criticalKpi
              }
            ],
            xaxis: { ...this.barChartOptions.xaxis, categories: data.data.barchart.categories }
          },
          barchart2: {
            series: [
              {
                name: 'Total KPI',
                color: '#5A9BD5',
                data: data.data.barchart2.data.totalKpi
              },
              {
                name: 'Critical KPI',
                color: '#ED7D31',
                data: data.data.barchart2.data.criticalKpi
              }
            ],
            xaxis: { ...this.barChart2Options.xaxis, categories: data.data.barchart2.categories }
          }
        }
      };
      this.qualityManagementPerformanceByBuCharts.push(qualityManagementPerformanceByBuChart);
    }
    this.radarChartOptions.chart.height = this.qualityManagementPerformanceByBuCharts.length > 3 ? 250 : 'auto'
  }
}
