import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyTargetComponent } from './my-target.component';
import { myTargetRoutes } from './my-target.routing';



@NgModule({
  declarations: [
    MyTargetComponent
  ],
  imports: [
    RouterModule.forChild(myTargetRoutes)
  ]
})
export class MyTargetModule { }
