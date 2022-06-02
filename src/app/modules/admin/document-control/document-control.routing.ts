import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { OrganizesResolver } from 'app/shared/resolver';
import { DocumentControlComponent } from './document-control.component';

export const documentControlRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: DocumentControlComponent,
        resolve: { organizes: OrganizesResolver }
    }
];
