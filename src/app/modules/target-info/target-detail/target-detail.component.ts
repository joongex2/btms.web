import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../target.service';
import { RunningNo, TargetRecord } from '../target.types';

@Component({
  selector: 'app-target-detail',
  templateUrl: './target-detail.component.html',
})
export class TargetDetailComponent implements OnInit {
  runningNoParam: string;
  runningNo: RunningNo;
  targets: TargetRecord[];
  haveRunningNo: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _targetService: TargetService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.runningNoParam = params.get('runningNo');
      this.runningNo = this._targetService.getRunningNo(this.runningNoParam);
      if (!this.runningNo) {
        this.router.navigate(['404-not-found']);
        return;
      }
      this.targets = this._targetService.getTargets(this.runningNoParam);
    });
  }

}
