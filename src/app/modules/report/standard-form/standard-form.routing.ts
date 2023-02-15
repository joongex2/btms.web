import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { OrganizesResolver, DocumentStatusesResolver, DocumentTypesResolver, TargetTypesResolver, BusResolver, SubBusResolver, PlantsResolver, DivisionsResolver } from 'app/shared/resolver';
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
            subBus: SubBusResolver,
            plants: PlantsResolver,
            divisions: DivisionsResolver
        }
    }
];
