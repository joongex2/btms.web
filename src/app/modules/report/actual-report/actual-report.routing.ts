import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DivisionsResolver, DocumentStatusesResolver, DocumentTypesResolver, OrganizesResolver, TargetTypesResolver } from 'app/shared/resolver';
import { ActualReportComponent } from './actual-report.component';


export const actualReportRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: ActualReportComponent,
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
