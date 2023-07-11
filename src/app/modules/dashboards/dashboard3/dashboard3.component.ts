/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { ActionPlanStatus, ActionPlanStatusChart } from '../dashboard.interfaces';
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
export class Dashboard3Component implements OnInit, OnChanges {
  @Input() bus: any[] = [];
  @Input() subBus: any[] = [];
  @Input() plants: any[] = [];
  public radarChartOptions: Partial<RadarChartOptions>;
  public barChartOptions: Partial<BarChartOptions>;
  public barChart2Options: Partial<BarChartOptions>;
  filteredPlants: any[] = [];
  form: FormGroup;

  // bind value
  today: any;

  actionPlanStatusCharts: ActionPlanStatusChart[];

  constructor(
    private _formBuilder: FormBuilder,
    private _dashboardService: DashboardService,
    private _cdr: ChangeDetectorRef
  ) {
    this.radarChartOptions = {
      series: [
        {
          name: 'Total KPI',
          data: [1.2, 0.2, 0.3, 0.8, 0.3, 0.8, 1, 1.5]
        },
        {
          name: 'Critical',
          data: [0.2, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.2]
        }
      ],
      chart: {
        height: 250,
        type: 'radar'
      },
      xaxis: {
        categories: ['Productivity', 'Quality', 'Food', 'Cost', 'Delivery', 'Morale', 'Safety', 'Environment']
      },
      colors: ['#32CD32', '#FF0000']
    };

    this.barChartOptions = {
      series: [
        {
          name: 'Total KPI',
          color: '#5A9BD5',
          data: [93, 92, 94, 91]
        }
      ],
      chart: {
        type: 'bar',
        height: 150
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
      xaxis: {},
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
      series: [
        {
          name: 'Total KPI',
          color: '#ED7D31',
          data: [93, 92, 94, 91]
        }
      ],
      chart: {
        type: 'bar',
        height: 150
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
      xaxis: {},
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.plants) {
      this.filteredPlants = [];
    }
  }

  ngOnInit(): void {
    this.today = moment();
    this.form = this._formBuilder.group({
      dateUpdate: { value: this.today, disabled: true },
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
    const businessUnits = [];
    const bus = this.form.get('bus').value;
    for (const bu of bus) {
      businessUnits.push({
        businessUnitCode: bu.value,
        plants: []
      });
    }
    const plants = this.form.get('plants').value;
    if (plants) {
      for (const plant of plants) {
        const _plant = this.plants.find(v => v.value === plant.value);
        const subBu = this.subBus.find(v => v.id === _plant.parentId);
        const bu = this.bus.find(v => v.id === subBu.parentId);
        for (const resBu of businessUnits) {
          if (bu.value === resBu.businessUnitCode) {
            resBu.plants.push({
              plantCode: plant.value
            });
          }
        }
      }
    }
    this._dashboardService.actionPlanStatus(businessUnits).subscribe((v) => {
      this.parseActionPlanStatus(v);
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

  parseActionPlanStatus(res: ActionPlanStatus[]) {
    this.actionPlanStatusCharts = [];
    for (const data of res) {
      const actionPlanStatusChart: ActionPlanStatusChart = {
        name: data.name,
        data: {
          radar: {
            series: data.data.radar.data,
            xaxis: { categories: data.data.radar.categories }
          },
          totalKpiTable: data.data.totalKpiTable,
          totalKpiBar: {
            series: [{
              name: 'Total KPI',
              color: '#5A9BD5',
              data: data.data.totalKpiBar.data
            }],
            xaxis: { ...this.barChartOptions.xaxis, categories: data.data.totalKpiBar.categories }
          },
          // criticalKpiTable: data.data.criticalKpiTable,
          // criticalKpiBar: {
          //   series: [{
          //     name: 'Total KPI',
          //     color: '#5A9BD5',
          //     data: data.data.criticalKpiBar.data
          //   }],
          //   xaxis: { ...this.barChartOptions.xaxis, categories: data.data.criticalKpiBar.categories }
          // } // TODO fix api
        }
      };
      this.actionPlanStatusCharts.push(actionPlanStatusChart);
    }
  }
}
