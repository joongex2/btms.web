export enum TargetManagementStatus {
    NEW = 'new', // from new-target
    EDIT = 'edit', // from my-target and click edit
    SUBMITTED = 'submitted', // from my-target
    CONFIRM = 'confirm', // after click submit
    REJECT = 'reject' // after click reject
}