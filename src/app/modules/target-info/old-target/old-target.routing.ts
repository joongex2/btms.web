import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { OldTargetComponent } from './old-target.component';

export const oldTargetRoutes: Route[] = [
    {
        path     : '',
        canActivate: [MenuGuard],
        component: OldTargetComponent
    }
];
