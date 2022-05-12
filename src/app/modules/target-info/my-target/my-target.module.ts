import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TargetListModule } from 'app/modules/target-list/target-list.module';
import { SharedModule } from 'app/shared/shared.module';
import { TargetManagementModule } from '../target-management/target-management.module';
import { MyTargetComponent } from './my-target.component';
import { myTargetRoutes } from './my-target.routing';



@NgModule({
  declarations: [
    MyTargetComponent
  ],
  imports: [
    RouterModule.forChild(myTargetRoutes),
    TargetListModule,
    TargetManagementModule,
    SharedModule,
  ]
})
export class MyTargetModule { }
