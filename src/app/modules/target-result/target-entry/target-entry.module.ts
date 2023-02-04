import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TargetListModule } from 'app/modules/target-list/target-list.module';
import { SharedModule } from 'app/shared/shared.module';
import { TargetCauseFixModule } from '../target-cause-fix/target-cause-fix.module';
import { TargetEntryDetailModule } from '../target-entry-detail/target-entry-detail.module';
import { TargetSaveModule } from '../target-save/target-save.module';
import { TargetEntryComponent } from './target-entry.component';
import { targetEntryRoutes } from './target-entry.routing';

@NgModule({
  declarations: [
    TargetEntryComponent
  ],
  imports: [
    RouterModule.forChild(targetEntryRoutes),
    TargetListModule,
    TargetEntryDetailModule,
    TargetSaveModule,
    TargetCauseFixModule,
    SharedModule
  ]
})
export class TargetEntryModule { }
