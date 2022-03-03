import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { MyTargetComponent } from './my-target.component';

export const myTargetRoutes: Route[] = [
    {
        path     : '',
        canActivate: [MenuGuard],
        component: MyTargetComponent
    }
];
