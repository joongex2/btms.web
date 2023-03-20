import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { OrganizesResolver, DocumentStatusesResolver, DocumentTypesResolver, TargetTypesResolver, BusResolver, SubBusResolver, PlantsResolver, DivisionsResolver, TargetActualStatusesResolver } from 'app/shared/resolver';
import { TargetTrackComponent } from './target-track.component';


export const targetTrackRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: TargetTrackComponent,
        resolve: {
            organizes: OrganizesResolver,
            statuses: TargetActualStatusesResolver,
            documentTypes: DocumentTypesResolver,
            targetTypes: TargetTypesResolver,
            bus: BusResolver,
            divisions: DivisionsResolver
        }
    }
];
