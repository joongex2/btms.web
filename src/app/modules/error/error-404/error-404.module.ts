import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './error-404.component';
import { RouterModule } from '@angular/router';
import { error404Routes } from './error-404.routing';



@NgModule({
  declarations: [
    Error404Component
  ],
  imports: [
    RouterModule.forChild(error404Routes)
  ]
})
export class Error404Module { }
