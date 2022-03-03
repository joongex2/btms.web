import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { UserGroupComponent } from './user-group.component';

export const groupRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: UserGroupComponent
    }
];
