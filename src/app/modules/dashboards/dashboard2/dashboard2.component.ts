import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { DonutChartOptions } from '../dashboard1/dashboard1.component';

@Component({
  selector: 'dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss']
})
export class Dashboard2Component implements OnInit {
  @ViewChild("donutChart1") donutChart1: ChartComponent;
  @ViewChild("donutChart2") donutChart2: ChartComponent;
  public donutChart1Options: Partial<DonutChartOptions>;
  public donutChart2Options: Partial<DonutChartOptions>;

  actionPlanDetails = {
    columns: ['documentNo', 'subTarget', 'status', 'contact'],
    rows: [
      {
        id: 1,
        documentNo: 'SOV-FCPPPP-63-09',
        subTarget: '1. 5. ควบคุมค่าพารามิเตอร์ Oil and Grease ของมาตรฐานน้ำทิ้ง ให้อยู่ในเกณฑ์ที่ดีกว่าที่กฎหมายกำหนด',
        status: 'Draft',
        contact: 'kanitak',
      },
      {
        id: 2,
        documentNo: 'SOV-WHPPPP-63-10',
        subTarget: '1.1. รายงานการกระทำ/สภาพที่เป็นอันตราย/อันตรายที่ได้รับการขึ้นทะเบียน',
        status: 'Draft',
        contact: 'kanitak',
      },
      {
        id: 3,
        documentNo: 'SOV-FCPPPP-63-11',
        subTarget: '1. 5. ควบคุมค่าพารามิเตอร์ Oil and Grease ของมาตรฐานน้ำทิ้ง ให้อยู่ในเกณฑ์ที่ดีกว่าที่กฎหมายกำหนด',
        status: 'Draft',
        contact: 'kanitak',
      }
    ]
  }

  constructor() {
    this.donutChart1Options = {
      series: [30, 41],
      chart: {
        type: "donut",
        width: "100%"
      },
      labels: ["Overdue", "On plan"],
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
      ]
    };

    this.donutChart2Options = {
      series: [3, 4, 5, 30],
      chart: {
        type: "donut",
        width: "100%"
      },
      labels: ["Draft", "Inprocess", "Wait for Verify", "Wait for Approve"],
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
      ]
    };
  }

  ngOnInit(): void {
  }

}
