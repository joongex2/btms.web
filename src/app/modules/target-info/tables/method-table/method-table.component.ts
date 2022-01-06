import { Component, Input, OnInit } from '@angular/core';
import { Method } from './../../target.types';

@Component({
  selector: 'app-method-table',
  templateUrl: './method-table.component.html',
  styleUrls: ['./method-table.component.scss']
})
export class MethodTableComponent implements OnInit {
  @Input() runningNo: string;
  @Input() targetId: string;
  @Input() methods: Method[];

  displayedColumns: string[] = [
    'Method ID',
    'Method Name',
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
    'Dec',
    'Owner'
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
