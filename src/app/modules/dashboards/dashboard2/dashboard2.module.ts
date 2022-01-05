import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Dashboard2Component } from './dashboard2.component';
import { dashboard2Routes } from './dashboard2.routing';



@NgModule({
  declarations: [
    Dashboard2Component
  ],
  imports: [
    RouterModule.forChild(dashboard2Routes)
  ]
})
export class Dashboard2Module { }
