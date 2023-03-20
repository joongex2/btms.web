import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DivisionsResolver, DocumentStatusesResolver, DocumentTypesResolver, OrganizesResolver, TargetTypesResolver } from 'app/shared/resolver';
import { AnnualReportComponent } from './annual-report.component';


export const annualReportRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: AnnualReportComponent,
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
