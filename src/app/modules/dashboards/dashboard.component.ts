import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from './dashboard.service';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedProject: string = 'Quality Management Performance';
  bus: any[] = [];
  subBus: any[] = [];
  plants: any[] = [];

  constructor(
    private _dashboardService: DashboardService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.bus = this._activatedRoute.snapshot.data.bus;
    this.subBus = this._activatedRoute.snapshot.data.subBus;
    this.plants = this._activatedRoute.snapshot.data.plants;
  }
  ngOnDestroy(): void { }
}
