export interface ModalData {
    mode: ModalMode,
    data: any;
    index?: number;
}

export enum ModalMode {
    ADD,
    EDIT
} 