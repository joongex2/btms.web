import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { MasterComponent } from './master.component';

export const masterRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: MasterComponent
    }
];
