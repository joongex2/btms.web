import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { Organize, User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { TargetManagementStatus } from '../../target-management.interface';
import { TargetManagementService } from '../../target-management.service';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  organizes: Organize[];
  documentId: string;
  targetManagementStatus: TargetManagementStatus;
  TargetManagementStatus = TargetManagementStatus;
  isMyTargetUrl: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _targetManagementService: TargetManagementService
  ) { }

  ngOnInit(): void {
    if (this._router.url.includes('/target-info/my-target')) {
      this.isMyTargetUrl = true;
    }
    this.documentId = this._targetManagementService.documentId;
    this.targetManagementStatus = this._targetManagementService.targetManagementStatus;
    // Subscribe to user changes
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.organizes = user.organizes;
        for (let org of this.organizes) {
          org.canCreate = false;
          for (let role of org.roles) {
            if (role.roleCode === 'D01') org.canCreate = true;
          }
        }
      });
  }

  ngAfterViewInit() { }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  goBack() {
    this._targetManagementService.targetManagementStatus = TargetManagementStatus.SUBMITTED;
    this._router.navigate(['../'], { relativeTo: this._activatedRoute });
  }

  send() {
    // save and clear
    // this._newTargetService.clear();
    console.log('send');
  }
}
