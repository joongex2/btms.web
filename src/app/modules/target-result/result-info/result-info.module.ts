import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TargetListModule } from 'app/modules/target-list/target-list.module';
import { SharedModule } from 'app/shared/shared.module';
import { TargetEntryDetailModule } from '../target-entry-detail/target-entry-detail.module';
import { TargetSaveModule } from '../target-save/target-save.module';
import { ResultInfoComponent } from './result-info.component';
import { resultInfoRoutes } from './result-info.routing';



@NgModule({
  declarations: [
    ResultInfoComponent
  ],
  imports: [
    RouterModule.forChild(resultInfoRoutes),
    TargetListModule,
    TargetEntryDetailModule,
    TargetSaveModule,
    SharedModule
  ]
})
export class ResultInfoModule { }
