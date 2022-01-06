import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTargetModalComponent } from '../../modals/add-target-modal/add-target-modal.component';
import { RunningNoData, Target } from '../../target.types';

@Component({
  selector: 'target-management',
  templateUrl: './target-management.component.html',
})
export class TargetManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'expandIcon',
    'Target ID',
    'Name',
    'Standard',
    'Relative Target',
    'deleteIcon'
  ];  

  @Input()
  targets: Target[];
  @Input()
  runningNo: string;
  @Input()
  runningNoData: RunningNoData;
  @Input()
  haveRunningNo: boolean = false;

  constructor(private _matDialog: MatDialog) { }

  ngOnInit(): void {
    console.log('hello');
  }

  deleteTarget(index: number) {
    console.log('delete target');
  }

  addTarget(): void
  {
      // Open the dialog
      const dialogRef = this._matDialog.open(AddTargetModalComponent);

      dialogRef.afterClosed()
      .subscribe((result) => {
          console.log('Compose dialog was closed!');
      });
  }

}
