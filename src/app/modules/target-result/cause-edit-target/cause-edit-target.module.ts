import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ReferenceListModule } from '../reference-list/reference-list.module';
import { TargetCauseFixModule } from '../target-cause-fix/target-cause-fix.module';
import { CauseEditTargetComponent } from './cause-edit-target.component';
import { causeEditTargetRoutes } from './cause-edit-target.routing';

@NgModule({
  declarations: [
    CauseEditTargetComponent
  ],
  imports: [
    RouterModule.forChild(causeEditTargetRoutes),
    ReferenceListModule,
    TargetCauseFixModule,
    SharedModule
  ]
})
export class CauseEditTargetModule { }
