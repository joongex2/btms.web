import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Dashboard3Component } from './dashboard3.component';
import { dashboard3Routes } from './dashboard3.routing';



@NgModule({
  declarations: [
    Dashboard3Component
  ],
  imports: [
    RouterModule.forChild(dashboard3Routes)
  ]
})
export class Dashboard3Module { }
