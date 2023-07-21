import { Route } from '@angular/router';
import { WelcomeComponent } from './welcome.component';

export const welcomeRoutes: Route[] = [
    {
        path: '',
        component: WelcomeComponent
    }
];
