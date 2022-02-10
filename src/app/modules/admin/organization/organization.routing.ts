import { Route } from '@angular/router';
import { OrganizationComponent } from './organization.component';
import { UserRoleComponent } from './user-role/user-role.component';

export const organizationRoutes: Route[] = [
    {
        path: '',
        component: OrganizationComponent
    },
    {
        path: 'user-role/:organizationCode',
        component: UserRoleComponent
    }
];
