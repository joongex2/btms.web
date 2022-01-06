import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../target.service';
import { RunningNoData, Target } from '../target.types';

@Component({
  selector: 'app-target-detail',
  templateUrl: './target-detail.component.html',
})
export class TargetDetailComponent implements OnInit {
  runningNo: string;
  runningNoData: RunningNoData;
  targets: Target[];
  haveRunningNo: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _targetService: TargetService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.runningNo = params.get('runningNo');
      this.runningNoData = this._targetService.getRunningNoData(this.runningNo);
      console.log(this.runningNoData);
      if (!this.runningNoData) {
        this.router.navigate(['404-not-found']);
        return;
      }
      if (this._targetService.getRunningNo(this.runningNo).kids.has_targets) {
        this.targets = this._targetService.getTargets(this.runningNo);
      }
    });
  }

}
