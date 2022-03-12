export interface ModalData {
    mode?: ModalMode,
    data: any;
}

export enum ModalMode {
    ADD,
    EDIT
}