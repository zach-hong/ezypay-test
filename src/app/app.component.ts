import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CustomValidators } from './shared/validator/custom-validators';
import { TestService } from './shared/services/test/test.service';
import { LoadingSpinnerDialogService } from './shared/components/loading-spinner-dialog/loading-spinner-dialog.service';
import { StandardDialogComponent } from './shared/components/standard-dialog/standard-dialog.component';

import * as moment from 'moment';
import _isEmpty from 'lodash/isEmpty';
import _includes from 'lodash/includes';
import _cloneDeep from 'lodash/cloneDeep';
import _uniq from 'lodash/uniq';
import _forEach from 'lodash/forEach';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EZYPAY Test Accessment';

  amountFormControl = new FormControl(null, Validators.compose([Validators.required, CustomValidators.twoDecimalValidator]));
  hourFormControl = new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(2), CustomValidators.twentyFourHourValidator]));
  dateFormControl = new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(2), CustomValidators.dateValidator]));
  startDtFormControl = new FormControl(null, Validators.compose([Validators.required, this.checkStartEndDate.bind(this)]));
  endDtFormControl = new FormControl(null, Validators.compose([Validators.required, this.checkStartEndDate.bind(this)]));

  selectedType: any;
  subTypes: string[] = ['DAILY', 'WEEKLY', 'MONTHLY'];
  selectedDay: any;
  weekdays: any[] = [
    { name: 'MONDAY', value: 'monday' },
    { name: 'TUESDAY', value: 'tuesday' },
    { name: 'WEDNESDAY', value: 'wednesday' },
    { name: 'THURSDAY', value: 'thursday' },
    { name: 'FRIDAY', value: 'friday' },
    { name: 'SATURDAY', value: 'saturday' },
    { name: 'SUNDAY', value: 'sunday' }
  ];

  todayDate;

  constructor(
    private testService: TestService,
    private loadingSpinnerService: LoadingSpinnerDialogService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.todayDate = moment().toDate();
    this.selectedType = 'DAILY';
  }

  checkStartEndDate() {
    if (this.endDtFormControl && this.startDtFormControl) {
      let endDt = moment(this.endDtFormControl.value);
      let startDt = moment(this.startDtFormControl.value);
      // console.log(endDt.diff(startDt, 'months'));
      if (endDt.diff(startDt, 'months') >= 3) {
        return { dateExceed: { valid: false } };
      }
    }
    return null;
  }

  subscriptionTypeChanged(event) {
    if (this.selectedType === 'WEEKLY') {
      this.selectedDay = 'monday';
    }
  }

  fieldsValid() {
    if (this.amountFormControl && this.selectedType && this.startDtFormControl && this.endDtFormControl) {
      // AMOUNT
      let amountValid = this.amountFormControl.valid;
      // SELECTED SUBSCRIPTION TYPE
      let subcripValid = null;
      switch (this.selectedType) {
        case 'DAILY':
          subcripValid = this.hourFormControl.valid;
          break;
        case 'MONTHLY':
          subcripValid = this.dateFormControl.valid;
          break;
        default:
          break;
      }
      // START DATE
      let startDtValid = this.startDtFormControl.valid;
      // END DATE
      let endDtValid = this.endDtFormControl.valid;

      let allValid = !(amountValid && startDtValid && endDtValid);
      if (subcripValid !== null) {
        allValid = !(amountValid && subcripValid && startDtValid && endDtValid);
      }
      return allValid;
    }
    return false;
  }

  submit() {
    let payload = {};
    payload['amount'] = Number(Number(this.amountFormControl.value).toFixed(2));
    payload['subscriptionType'] = this.selectedType;
    if (this.selectedType === 'DAILY') {
      payload['subscriptionTypeValue'] = Number(this.hourFormControl.value)
    } else if (this.selectedType === 'WEEKLY') {
      payload['subscriptionTypeValue'] = this.selectedDay;
    } else if (this.selectedType === 'MONTHLY') {
      payload['subscriptionTypeValue'] = Number(this.dateFormControl.value);
    }
    payload['startDate'] = moment(this.startDtFormControl.value).format('DD-MM-YYYY');
    payload['endDate'] = moment(this.endDtFormControl.value).format('DD-MM-YYYY');

    this.loadingSpinnerService.showSpinner(true);
    this.testService.addSubscription(payload).then(() => {
      this.loadingSpinnerService.showSpinner(false);
      this.showDialog();

    }).catch(err => {
      this.loadingSpinnerService.showSpinner(false);
      this._snackBar.open('Create Failed', null, { duration: 4000 });
      console.error(err);
    });
  }

  showDialog() {
    let invoiceDt = this.generateInvoiceDate();
    
    let invStr = '';
    if (!_isEmpty(invoiceDt)) {
      let concatStr = '';
      let splited = JSON.stringify(invoiceDt).replace(/[\[\]\"]/g, '').split(',');
      _forEach(splited, (s, idx) => {
        if (splited.length - 1 === idx) {
          concatStr += '<b>' + s + '</b>';
        } else {
          concatStr += '<b>' + s + '</b>, ';
        }
      });
      invStr = concatStr;
    }
    let str = 'Amount entered: <b>' + Number(this.amountFormControl.value).toFixed(2) + '</b>.<br/>Subscription type: <b>' + this.selectedType + '</b>.<br/>Invoice Dates: ' + invStr;
    let msg = 'Successfully Created!<br/><br/>' + str;

    let dialogRef;
    const dialogData = {
      title: 'Success',
      message: msg,
      positive: {
        title: 'OK',
        click: function () {
          dialogRef.close();
        }
      }
    };
    dialogRef = this.dialog.open(StandardDialogComponent, {
      minWidth: '30%',
      data: dialogData
    });
  }

  generateInvoiceDate() {
    let invoiceDates = [];
    if (this.selectedType === 'DAILY') {
      invoiceDates = this.getDatesByDaily(this.startDtFormControl.value, this.endDtFormControl.value);
    } else if (this.selectedType === 'WEEKLY') {
      invoiceDates = this.getDatesByWeekly(this.selectedDay, this.startDtFormControl.value, this.endDtFormControl.value);
    } else if (this.selectedType === 'MONTHLY') {
      invoiceDates = this.getDatesByMonthly(Number(this.dateFormControl.value), this.startDtFormControl.value, this.endDtFormControl.value);
    }
    return invoiceDates;
  }

  getDatesByDaily(startDate, stopDate) {
    let dateArray = [];
    let currentDt = moment(startDate);
    let stopDt = moment(stopDate);
    while (currentDt <= stopDt) {
      dateArray.push(currentDt.format('DD/MM/YYYY'));
      currentDt = currentDt.add(1, 'days');
    }
    return dateArray;
  }

  getDatesByWeekly(selectedDay, startDate, stopDate) {
    let dateArray = [];
    let currentDt = moment(startDate);
    let stopDt = moment(stopDate);
    while (currentDt <= stopDt) {
      let day = currentDt.format('dddd').toLowerCase();
      if (day === selectedDay) {
        dateArray.push(currentDt.format('DD/MM/YYYY'));
      }
      currentDt = currentDt.add(1, 'days');
    }
    return dateArray;
  }

  getDatesByMonthly(whichDate, startDate, stopDate) {
    let dateArray = [];
    if (whichDate === 28 || whichDate === 29 || whichDate === 30 || whichDate === 31) {

      let currentDt = moment(startDate);
      let stopDt = moment(stopDate);
      while (currentDt <= stopDt) {
        let date = Number(currentDt.format('DD'));
        let month = currentDt.format('MM');
        let year = currentDt.format('YYYY');

        if (whichDate === date) {
          dateArray.push(currentDt.format('DD/MM/YYYY'));
        } else {
          if (date >= 27) {
            let wDate = String(_cloneDeep(whichDate));

            if (!moment(wDate + '/' + month + '/' + year, 'DD/MM/YYYY').isValid()) {
              let currentDtCloned = _cloneDeep(currentDt);
              dateArray.push(currentDtCloned.endOf('month').format('DD/MM/YYYY'));
            }
          }
        }

        currentDt = currentDt.add(1, 'days');
      }
      dateArray = _uniq(dateArray);
    } else {
      let currentDt = moment(startDate);
      let stopDt = moment(stopDate);
      while (currentDt <= stopDt) {
        let date = Number(currentDt.format('DD'));
        if (whichDate === date) {
          dateArray.push(currentDt.format('DD/MM/YYYY'));
        }
        currentDt = currentDt.add(1, 'days');
      }
    }
    return dateArray;
  }

}
