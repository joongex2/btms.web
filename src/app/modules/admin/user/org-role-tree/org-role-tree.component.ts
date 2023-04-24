import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { AdminUserService } from 'app/modules/super-admin/admin-user/admin-user.service';
import { Organization } from 'app/modules/super-admin/organization/organization.types';
import { RoleService } from 'app/modules/super-admin/role/role.service';
import { Role } from 'app/modules/super-admin/role/role.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { detailExpandAnimation } from 'app/shared/table-animation';
import { Subject, takeUntil } from 'rxjs';
import { OrganizeNode, RoleNode } from './node.interface';

@Component({
  selector: 'org-role-tree',
  templateUrl: './org-role-tree.component.html',
  styleUrls: ['./org-role-tree.component.scss'],
  animations: [detailExpandAnimation]
})
export class OrgRoleTreeComponent implements OnInit {
  @Input() organizeNodes: OrganizeNode[];
  @Input() selectedOrganize: any;
  originOrganizeNodes: OrganizeNode[];
  organizations: { title: string, value: string }[];
  roles: { title: string, value: string }[];
  organizeCodeNameMapper: { [key: string]: string };
  roleCodeNameMapper: { [key: string]: string };
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  valid: boolean = true;

  JSON = JSON;

  constructor(
    private _userService: UserService,
    private _adminUserService: AdminUserService,
    private _roleService: RoleService,
    private _confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
      this._adminUserService.getAdminUserOrganizes(user.id).subscribe({
        next: (v: Organization[]) => {
          this.organizations = v.map((v) => ({ title: `${v.organizeCode}: ${v.organizeName}`, value: v.organizeCode }));
          this.organizeCodeNameMapper = v.reduce((prev, cur) => {
            prev[cur.organizeCode] = `${cur.organizeCode}: ${cur.organizeName}`;
            return prev;
          }, {});
        },
        error: (e) => console.error(e)
      });
    });

    this._roleService.getRoles().subscribe({
      next: (v: Role[]) => {
        this.roles = v.map((v) => ({ title: v.code, value: v.code }));
        this.roleCodeNameMapper = v.reduce((prev, cur) => {
          prev[cur.code] = `${cur.code}: ${cur.name}`;
          return prev;
        }, {});
      },
      error: (e) => console.error(e)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('organizeNodes' in changes && this.organizeNodes) {
      this.organizeNodes = this.organizeNodes.map((v) => ({ ...v, expand: false }));
      this.originOrganizeNodes = [...this.organizeNodes];
    } else if ('selectedOrganize' in changes) {
      if (!this.selectedOrganize) {
        this.organizeNodes = [...this.originOrganizeNodes];
      } else if (typeof this.selectedOrganize === 'string') {
        this.organizeNodes = this.originOrganizeNodes.filter(v => v.organizeCode.toLowerCase().includes(this.selectedOrganize.toLowerCase()));
      } else {
        this.organizeNodes = this.originOrganizeNodes.filter(v => v.organizeCode.toLowerCase() === this.selectedOrganize.title.toLowerCase());
      }
    }
  }

  addOrganize() {
    if (this.organizeNodes.find(v => v.organizeCode === '')) {
      this._confirmationService.warning('Please save first!');
      return;
    }
    this.organizeNodes.push({
      organizeCode: '',
      isActive: true,
      roles: [],
      expand: false
    });
  }

  saveOrganizeNode(organizeNode: OrganizeNode, itemValue: string) {
    // check empty
    if (!itemValue) {
      this._confirmationService.warning('Please select!');
      return;
    }

    // check duplicate
    for (let node of this.organizeNodes) {
      if (node.organizeCode === itemValue) {
        this._confirmationService.warning('Duplicate value!');
        return;
      }
    }

    organizeNode.organizeCode = itemValue;
  }

  deleteOrganizeNode(index: number) {
    this.organizeNodes.splice(index, 1);
  }

  addNewRole(organizeNode: OrganizeNode) {
    if (organizeNode.roles.find(v => v.roleCode === '')) {
      this._confirmationService.warning('Please save first!');
      return;
    }
    organizeNode.roles.push({
      roleCode: '',
      isActive: true
    });

    organizeNode.expand = true;
  }

  saveRoleNode(organizeNode: OrganizeNode, roleNode: RoleNode, itemValue: string) {
    // check empty
    if (!itemValue) {
      this._confirmationService.warning('Please select!');
      return;
    }

    // check duplicate
    for (let roleNode of organizeNode.roles) {
      if (roleNode.roleCode === itemValue) {
        this._confirmationService.warning('Duplicate value!');
        return;
      }
    }

    roleNode.roleCode = itemValue;
  }

  deleteRoleNode(organizeNode: OrganizeNode, index: number) {
    organizeNode.roles.splice(index, 1);
  }

  getOutput(): any {
    let res = JSON.parse(JSON.stringify(this.organizeNodes));
    for (let _res of res) {
      delete _res.expand;
      if (_res.organizeCode === '') {
        this.valid = false;
        return false;
      }
    }
    this.valid = true;
    return res;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
