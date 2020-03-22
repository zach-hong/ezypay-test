import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { LoadingSpinnerDialogComponent } from './loading-spinner-dialog.component';

import _isEqual from 'lodash/isEqual';
import _each from 'lodash/each';


@Injectable()
export class LoadingSpinnerDialogService {

    private spinnerDialogId: string = 'globalSpinLoader';
    private spinnerRef: MatDialogRef<LoadingSpinnerDialogComponent>;

    constructor(private matDialog: MatDialog) {
    }

    public getSpinnerRef() {
        return this.spinnerRef;
    }

    public showSpinner(shudShow: boolean) {
        if (shudShow) {
            let dialogConfig = new MatDialogConfig();
            dialogConfig.id = this.spinnerDialogId;
            dialogConfig.disableClose = true;

            // setTimeout(() => {
                if (!this.spinnerIsOpen()) {
                    this.spinnerRef = this.matDialog.open(LoadingSpinnerDialogComponent, dialogConfig);
                }
            // }, 100);
        } else {

            //fix timing issue when show and hide too fast
            // setTimeout(() => {
                if (this.spinnerRef && this.spinnerIsOpen()) {
                    this.spinnerRef.close();
                }
            // }, 200);

        }
    }

    public spinnerIsOpen() {
        let isOpen = false;
        _each(this.matDialog.openDialogs, (val: MatDialogRef<any>) => {
            if (_isEqual(val.id, this.spinnerDialogId)) {
                isOpen = true;
                return false;
            }
        });
        return isOpen;
    }
}