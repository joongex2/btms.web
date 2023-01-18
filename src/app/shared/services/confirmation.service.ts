import { Injectable } from "@angular/core";
import { FuseConfirmationService } from "@fuse/services/confirmation";


@Injectable()
export class ConfirmationService {
    constructor(private _fuseConfirmationService: FuseConfirmationService) { }

    send(title: string) {
        return this._fuseConfirmationService.open({
            title,
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

    delete(title?: string, message?: string) {
        return this._fuseConfirmationService.open({
            title: title || 'ต้องการลบข้อมูลใช่หรือไม่',
            message: message || '',
            icon: { name: 'heroicons_outline:question-mark-circle' },
            actions: {
                cancel: { show: true, label: 'ยกเลิก' },
                confirm: { show: true, label: 'ตกลง' }
            }
        });
    }

    warning(title: string, message?: string, showCancel = false) {
        return this._fuseConfirmationService.open({
            title,
            message: message || '',
            icon: { name: 'heroicons_outline:exclamation', color: 'warning' },
            actions: {
                cancel: { show: showCancel },
                confirm: { show: true, label: 'ตกลง', color: 'accent' }
            }
        });
    }
}