import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DivisionsResolver, DocumentTypesResolver, OrganizesResolver, PlantsResolver, DocumentStatusesResolver, SubBusResolver, TargetTypesResolver } from 'app/shared/resolver';
import { ExportReportComponent } from './export-report.component';


export const exportReportRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: ExportReportComponent,
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
