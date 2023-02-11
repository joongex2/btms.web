import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedProject: string = 'dashboard1';

  constructor(
    private _dashboardService: DashboardService,
    private _router: Router
  ) { }

  ngOnInit(): void { }
  ngOnDestroy(): void { }
}
