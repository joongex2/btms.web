import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { WelcomeComponent } from './welcome.component';
import { welcomeRoutes } from './welcome.routing';

@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    RouterModule.forChild(welcomeRoutes),
    SharedModule
  ]
})
export class WelcomeModule { }
