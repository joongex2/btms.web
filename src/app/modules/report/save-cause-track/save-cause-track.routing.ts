import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DivisionsResolver, DocumentStatusesResolver, DocumentTypesResolver, OrganizesResolver, TargetTypesResolver } from 'app/shared/resolver';
import { SaveCauseTrackComponent } from './save-cause-track.component';


export const saveCauseTrackRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: SaveCauseTrackComponent,
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
