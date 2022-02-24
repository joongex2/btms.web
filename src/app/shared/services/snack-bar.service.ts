import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class SnackBarService {
    constructor(private _matSnackBar: MatSnackBar) { }

    success(message = 'บันทึกเสร็จสมบูรณ์') {
        this._matSnackBar.open(message, '', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: ['success-snackbar']
        });
    }

    error(message = 'เกิดข้อผิดพลาด') {
        this._matSnackBar.open(message, '', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: ['error-snackbar']
        });
    }
}