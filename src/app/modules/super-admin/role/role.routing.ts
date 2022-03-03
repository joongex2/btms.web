import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { RoleComponent } from './role.component';

export const roleRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: RoleComponent
    }
];
