import { AbstractControl } from '@angular/forms';
import isEmpty from 'lodash/isEmpty';

export class CustomValidators {

    static twoDecimalValidator(control) {
        const expression = /^[0-9]+(\.[0-9]{2})?$/;
        const expression2 = /^[0-9]{1}?$/;
        if (control.value && !isEmpty(String(control.value))) {
            if (expression.test(String(control.value)) || expression2.test(String(control.value))) {
                return null;
            } else {
                return { twoDecimalPattern: {valid: false} };
            }
        }
        return null;
    }

    static twentyFourHourValidator(control) {
        const expression = /^[0-9]+$/;
        if (control.value && !isEmpty(String(control.value))) {
            if (expression.test(String(control.value))) {
                if (Number(control.value) >= 0 && Number(control.value) <= 23) {
                    return null;
                }   
            }
            return { hourPattern: {valid: false} };
        }
        return null;
    }

    static dateValidator(control) {
        const expression = /^[0-9]+$/;
        if (control.value && !isEmpty(String(control.value))) {
            if (expression.test(String(control.value))) {
                if (Number(control.value) >= 1 && Number(control.value) <= 31) {
                    return null;
                }   
            }
            return { datePattern: {valid: false} };
        }
        return null;
    }

}
