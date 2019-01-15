/*Next is QuestionControlService, a simple service for transforming the
questions to a FormGroup. In a nutshell, the form group consumes the metadata
from the question model and allows you to specify default values and validation rules.*/

import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from './question-base';
import { DateService }  from '../shared/date.service';

import { CustomValidators } from 'ng5-validation';

@Injectable()
export class QuestionControlService {
    constructor(private dateService: DateService) {

    }

    toFormGroup(questions: QuestionBase<any>[] ) {
        let group: any = {};

        if(questions && questions.forEach) {
            questions.forEach(question => {
                let validators = this.createValidatorsList(question);

                //group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
                //    : new FormControl(question.value || '');

                group[question.key] = new FormControl(question.value || '', validators);
            });
            return new FormGroup(group);
        }
    }


    createValidatorsList(question){

        let result = [];

        if(question.required){
            result.push(Validators.required);
        }

        if(question['minLength'] !== undefined){
            result.push(Validators['minLength'](question['minLength']));
        }

        if(question['min'] !== undefined){
            result.push(Validators['min'](question['min']));
        }

        if(question['max'] !== undefined){
            result.push(Validators['max'](question['max']));
        }

        if(question['minDate'] !== undefined && question['minDate'] !== ''){
            console.log('createValidatorsList',question['minDate']);
            result.push(CustomValidators['minDate'](question['minDate']));
        }

        if(question['maxDate'] !== undefined && question['maxDate'] !== ''){
            console.log('createValidatorsList',question['maxDate']);
            result.push(CustomValidators['maxDate'](question['maxDate']));
        }

        /*if(question['maxDate'] !== undefined && question['maxDate'] !== ''){

            let maxDate = this.dateService.TtoJSConvert(question['maxDate']);

            console.info('maxDate - ',maxDate);

            result.push(CustomValidators['maxDate'](maxDate));
            //result.push(CustomValidators['maxDate'](maxDate));
        }*/

        return result.length ? result : null;
    }
}