import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OldTargetComponent } from './old-target.component';
import { oldTargetRoutes } from './old-target.routing';



@NgModule({
  declarations: [
    OldTargetComponent
  ],
  imports: [
    RouterModule.forChild(oldTargetRoutes)
  ]
})
export class OldTargetModule { }
