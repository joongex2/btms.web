import { Injectable } from "@angular/core";
import { FuseConfirmationService } from "@fuse/services/confirmation";


@Injectable()
export class ConfirmationService {
    constructor(private _fuseConfirmationService: FuseConfirmationService) { }

    send(title: string) {
        return this._fuseConfirmationService.open({
            title: title,
            message: '',
            icon: { name: 'heroicons_outline:question-mark-circle', color: 'primary' },
            actions: {
                cancel: { show: true, label: 'ยกเลิก' },
                confirm: { show: true, label: 'ตกลง', color: 'primary' }
            }
        });
    }

    save() {
        return this._fuseConfirmationService.open({
            title: 'ต้องการบันทึกข้อมูลใช่หรือไม่',
            message: '',
            icon: { name: 'heroicons_outline:question-mark-circle', color: 'primary' },
            actions: {
                cancel: { show: true, label: 'ยกเลิก' },
                confirm: { show: true, label: 'ตกลง', color: 'primary' }
            }
        });
    }

    delete() {
        return this._fuseConfirmationService.open({
            title: 'ต้องการลบข้อมูลใช่หรือไม่',
            message: '',
            icon: { name: 'heroicons_outline:question-mark-circle' },
            actions: {
                cancel: { show: true, label: 'ยกเลิก' },
                confirm: { show: true, label: 'ตกลง' }
            }
        });
    }

    warning(title: string) {
        return this._fuseConfirmationService.open({
            title,
            message: '',
            icon: { name: 'heroicons_outline:exclamation', color: 'warning' },
            actions: {
                cancel: { show: false },
                confirm: { show: true, label: 'ตกลง', color: 'accent' }
            }
        });
    }
}