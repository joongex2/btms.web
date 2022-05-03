import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { Organize, User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { NewTargetStatus } from '../new-target.interface';
import { NewTargetService } from '../new-target.service';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  organizes: Organize[];
  documentId: string;
  newTargetStatus: NewTargetStatus;
  NewTargetStatus = NewTargetStatus;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _newTargetService: NewTargetService
  ) { }

  ngOnInit(): void {
    this.documentId = this._newTargetService.documentId;
    this.newTargetStatus = this._newTargetService.newTargetStatus;
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
    this._newTargetService.newTargetStatus = NewTargetStatus.SUBMITTED;
    this._router.navigate(['../'], { relativeTo: this._activatedRoute });
  }

  send() {
    // save and clear
    // this._newTargetService.clear();
    console.log('send');
  }
}
