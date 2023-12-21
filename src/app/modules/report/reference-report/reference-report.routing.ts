import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DivisionsResolver, DocumentTypesResolver, OrganizesResolver, PlantsResolver, DocumentStatusesResolver, SubBusResolver, TargetTypesResolver, ReferenceStatusesResolver } from 'app/shared/resolver';
import { ReferenceReportComponent } from './reference-report.component';


export const referenceReportRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: ReferenceReportComponent,
        resolve: {
            organizes: OrganizesResolver,
            statuses: ReferenceStatusesResolver,
            documentTypes: DocumentTypesResolver,
            targetTypes: TargetTypesResolver,
            bus: BusResolver,
            divisions: DivisionsResolver
        }
    }
];
