import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DivisionsResolver, DocumentStatusesResolver, DocumentTypesResolver, OrganizesResolver, TargetTypesResolver } from 'app/shared/resolver';
import { StandardFormComponent } from './standard-form.component';


export const standardFormRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: StandardFormComponent,
        resolve: {
            organizes: OrganizesResolver,
            statuses: DocumentStatusesResolver,
            documentTypes: DocumentTypesResolver,
            targetTypes: TargetTypesResolver,
            bus: BusResolver,
            divisions: DivisionsResolver
        }
    }
];
