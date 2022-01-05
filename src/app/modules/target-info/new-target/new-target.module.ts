import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewTargetComponent } from './new-target.component';
import { newTragetRoutes } from './new-target.routing';



@NgModule({
  declarations: [
    NewTargetComponent
  ],
  imports: [
    RouterModule.forChild(newTragetRoutes)
  ]
})
export class NewTargetModule { }
