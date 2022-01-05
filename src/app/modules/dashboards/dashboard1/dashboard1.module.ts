import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Dashboard1Component } from './dashboard1.component';
import { dashboard1Routes } from './dashboard1.routing';



@NgModule({
  declarations: [
    Dashboard1Component
  ],
  imports: [
    RouterModule.forChild(dashboard1Routes)
  ]
})
export class Dashboard1Module { }
