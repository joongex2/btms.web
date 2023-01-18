import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatTree, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { AdminUserService } from 'app/modules/super-admin/admin-user/admin-user.service';
import { OrganizationService } from 'app/modules/super-admin/organization/organization.service';
import { Organization } from 'app/modules/super-admin/organization/organization.types';
import { RoleService } from 'app/modules/super-admin/role/role.service';
import { Role } from 'app/modules/super-admin/role/role.types';
import { ConfirmationService } from 'app/shared/services/confirmation.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';


/**
 * Node for to-do item
 */
export class TodoItemNode {
    children: TodoItemNode[];
    item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
    item: string;
    level: number;
    expandable: boolean;
}

// raw data example
const ORG_EXAMPLE = `{"organizations":[{"organizeCode":"BTG-LP1MK","roles":[{"roleCode":"D00"},{"roleCode":"D01"}]},{"organizeCode":"BTG-LPEN","roles":[{"roleCode":"D02"},{"roleCode":"R01"}]}]}`;

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
    'BTG-LP1MK': ['D00', 'D01'],
    'BTG-LPEN': ['D02', 'R01'],
}

// const TREE_DATA = {
//     Groceries: {
//         'Almond Meal flour': null,
//         'Organic eggs': null,
//         'Protein Powder': null,
//         Fruits: {
//             Apple: null,
//             Berries: ['Blueberry', 'Raspberry'],
//             Orange: null,
//         },
//     },
//     Reminders: ['Cook dinner', 'Read the Material Design spec', 'Upgrade Application to Angular'],
// };

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
    dataChange = new BehaviorSubject<TodoItemNode[]>([]);

    set data(todoItemNode: TodoItemNode[]) {
        this.dataChange.next(todoItemNode);
    }

    get data(): TodoItemNode[] {
        return this.dataChange.value;
    }

    constructor() {
        // this.initialize();
    }

    initialize() {
        // // Prepare input tree obj
        // const TREE_EXAMPLE = this.prepareInput(ORG_EXAMPLE);

        // console.log(TREE_EXAMPLE);

        // // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
        // //     file node as children.
        // // const data = this.buildFileTree(TREE_DATA, 0);
        // const data = this.buildFileTree(TREE_EXAMPLE, 0);

        // // Notify the change.
        // this.dataChange.next(data);
    }

    initializeData(organizes: any): TodoItemFlatNode[] {
        const { organizeTree, selected } = this.prepareInput(organizes);
        const data = this.buildFileTree(organizeTree, 0);
        this.dataChange.next(data);
        return selected;
    }

    prepareInput(organizations: any): { organizeTree: any, selected: TodoItemFlatNode[] } {
        // console.log('organizations: ', organizations);
        const organizeTree = {};
        const selected: TodoItemFlatNode[] = [];
        for (let org of organizations) {
            // level 0
            organizeTree[org.organizeCode] = [];
            if (org.isActive) selected.push({ item: org.organizeCode, level: 0, expandable: org.roles && org.roles.length > 0 });
            for (let role of org.roles) {
                // level 1
                organizeTree[org.organizeCode].push(role.roleCode);
                if (role.isActive) selected.push({ item: role.roleCode, level: 1, expandable: false });
            }
        }
        // console.log('organizeTree: ', organizeTree);
        // console.log('selected: ', selected);
        return { organizeTree, selected };
    }

    prepareOutput(selectionModel: SelectionModel<TodoItemFlatNode>): any {
        if (this.data.length == 0) return [];
        const organizations = [];
        for (let org of this.data) {
            // level 0
            if (org.item == '') continue;
            const roles = [];
            const orgIsActive = this.isInSelectionModel(selectionModel, org.item, 0) ? true : false;
            for (let role of org.children) {
                // level 1
                if (role.item == '') continue;
                const roleIsActive = this.isInSelectionModel(selectionModel, role.item, 1) ? true : false;
                roles.push({
                    roleCode: role.item,
                    isActive: roleIsActive
                })
            }
            organizations.push({
                organizeCode: org.item,
                isActive: orgIsActive,
                roles
            })
        }
        return organizations;
    }

    isInSelectionModel(selectionModel: SelectionModel<TodoItemFlatNode>, item: string, level: number) {
        return selectionModel.selected.find((select) => select.item == item && select.level == level);
    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `TodoItemNode`.
     */
    buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
        return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
            const value = obj[key];
            const node = new TodoItemNode();
            node.item = key;

            if (value != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value, level + 1);
                } else {
                    node.item = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    }

    /** Add an item to to-do list */
    insertRootItem() {
        // const newRootNode = new TodoItemNode();
        // newRootNode.item = name;
        // newRootNode.children = [];
        this.data.push({ item: '', children: [] } as TodoItemNode);
        this.dataChange.next(this.data);
    }

    insertItem(parent: TodoItemNode, name: string) {
        if (parent.children) {
            parent.children.push({ item: name } as TodoItemNode);
            this.dataChange.next(this.data);
        }
    }

    updateItem(node: TodoItemNode, name: string) {
        node.item = name;
        this.dataChange.next(this.data);
    }

    deleteItem(parent: TodoItemNode, node: TodoItemNode) {
        if (parent == null) {
            // if node is root level
            this.data = this.data.filter((data) => data.item != node.item);
        } else {
            parent.children = parent.children.filter((_node) => _node.item != node.item);
            this.dataChange.next(this.data);
        }
    }
}

/**
 * @title Tree with checkboxes
 */
@Component({
    selector: 'tree-checklist',
    templateUrl: './tree-checklist.html',
    styleUrls: ['./tree-checklist.scss'],
    providers: [ChecklistDatabase],
})
export class TreeChecklistComponent implements OnInit {
    @ViewChild('treeSelector') matTree: MatTree<any>;
    organizations: any[];
    organizeCodeNameMapper: { [key: string]: string };
    roles: any[];
    roleCodeNameMapper: { [key: string]: string };
    JSON = JSON;

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

    /** A selected parent node to be inserted */
    selectedParent: TodoItemFlatNode | null = null;

    /** The new item's name */
    newItemName = '';

    treeControl: FlatTreeControl<TodoItemFlatNode>;

    treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

    dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public _database: ChecklistDatabase,
        private _organizationService: OrganizationService,
        private _roleService: RoleService,
        private _confirmationService: ConfirmationService,
        private _userService: UserService,
        private _adminUserService: AdminUserService
    ) {
        this.treeFlattener = new MatTreeFlattener(
            this.transformer,
            this.getLevel,
            this.isExpandable,
            this.getChildren,
        );
        this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        _database.dataChange.subscribe(data => {
            this.dataSource.data = data;

            // fix tree not rerender
            let _data = this.dataSource.data;
            this.dataSource.data = [];
            this.dataSource.data = _data;
        });
    }

    ngOnInit() {
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

    getLevel = (node: TodoItemFlatNode) => node.level;

    isExpandable = (node: TodoItemFlatNode) => node.expandable;

    getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

    hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: TodoItemNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode =
            existingNode && existingNode.item === node.item ? existingNode : new TodoItemFlatNode();
        flatNode.item = node.item;
        flatNode.level = level;
        flatNode.expandable = !!node.children?.length;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    };

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: TodoItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected =
            descendants.length > 0 &&
            descendants.every(child => { return this.checklistSelection.isSelected(child); });
        return descAllSelected;
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child))
        return result && !this.descendantsAllSelected(node);
    }

    /** Whether no descendants or all the descendants empty */
    noRealDescendants(node: TodoItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        if (descendants && descendants.length == 0) {
            return false;
        } else {
            const result = descendants.every(child => child.item == '');
            return result;
        }
    }

    todoItemSelectionToggleOnlySelf(node: TodoItemFlatNode): void {
        this.checklistSelection.toggle(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: TodoItemFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.forEach(child => this.checklistSelection.isSelected(child));
        this.checkAllParentsSelection(node);
    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: TodoItemFlatNode): void {
        let parent: TodoItemFlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: TodoItemFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descSomeSelected =
            descendants.length > 0 &&
            descendants.some(child => {
                return this.checklistSelection.isSelected(child);
            });
        if (nodeSelected && !descSomeSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descSomeSelected) {
            this.checklistSelection.select(node);
        }
    }

    /* Get the parent node of a node */
    getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    addNewRootItem() {
        if (this._database.data.find(v => v.item === '')) {
            this._confirmationService.warning('Please save first!');
            return;
        }
        this._database.insertRootItem();
    }

    /** Select the category so we can insert the new item. */
    addNewItem(node: TodoItemFlatNode) {
        const nestedNode = this.flatNodeMap.get(node);
        if (nestedNode.children.find(v => v.item === '')) {
            this._confirmationService.warning('Please save first!');
            return;
        }
        this._database.insertItem(nestedNode!, '');
        // this.matTree.renderNodeChanges(this._database.data); // force update ui
        this.treeControl.expand(node);
    }

    /** Save the node to database */
    saveNode(node: TodoItemFlatNode, itemValue: string) {
        // check empty
        if (!itemValue) {
            this._confirmationService.warning('Please select!');
            return;
        }

        // check duplicate
        const parentNode = this.flatNodeMap.get(this.getParentNode(node));
        const siblingNodes = parentNode ? parentNode.children : this._database.data;
        for (let siblingNode of siblingNodes) {
            if (siblingNode.item == itemValue) {
                this._confirmationService.warning('Duplicate value!');
                return;
            }
        }

        const nestedNode = this.flatNodeMap.get(node);
        this._database.updateItem(nestedNode!, itemValue);

        for (let newNode of this.treeControl.dataNodes) {
            if (newNode.level == node.level && newNode.item == itemValue) {
                // if save new role tick
                this.checklistSelection.select(newNode);
            }
        }
    }

    deleteNode(node: TodoItemFlatNode) {
        // if (!node.expandable) {
        //     // if node have children
        //     this.todoItemSelectionToggle(node);
        // } else {
        //     this.todoLeafItemSelectionToggle(node);
        // }

        const _node = this.flatNodeMap.get(node);
        const parentNode = this.flatNodeMap.get(this.getParentNode(node));
        this._database.deleteItem(parentNode, _node);
    }

    setOrganizes(organizes: any): void {
        const selected = this._database.initializeData(organizes);
        for (let node of this.treeControl.dataNodes) {
            if (selected.find((s) => s.item == node.item && s.level == node.level)) this.checklistSelection.select(node);
        }
    }

    getOrganizes(): any {
        return this._database.prepareOutput(this.checklistSelection);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
