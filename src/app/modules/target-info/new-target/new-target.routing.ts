import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { NewTargetComponent } from './new-target.component';

export const newTargetRoutes: Route[] = [
    {
        path     : '',
        canActivate: [MenuGuard],
        component: NewTargetComponent
    }
];
