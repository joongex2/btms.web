import { Route } from '@angular/router';
import { MenuGuard } from 'app/core/auth/guards/menu.guard';
import { BusResolver, DivisionsResolver, DocumentTypesResolver, OrganizesResolver, PlantsResolver, StatusesResolver, SubBusResolver, TargetTypesResolver } from 'app/shared/resolver';
import { ExportReportComponent } from './export-report.component';


export const exportReportRoutes: Route[] = [
    {
        path: '',
        canActivate: [MenuGuard],
        component: ExportReportComponent,
        resolve: {
            organizes: OrganizesResolver,
            statuses: StatusesResolver,
            documentTypes: DocumentTypesResolver,
            targetTypes: TargetTypesResolver,
            bus: BusResolver,
            subBus: SubBusResolver,
            plants: PlantsResolver,
            divisions: DivisionsResolver
        }
    }
];
