/*It presents a list of questions, each bound to a <df-question>
component element. The <df-question> tag matches the DynamicFormQuestionComponent,
the component responsible for rendering the details of each individual question
based on values in the data-bound question object.*/

/*Notice this component can present any type of question in your model.
You only have two types of questions at this point but you can imagine many more.
The ngSwitch determines which type of question to display.

 In both components you're relying on Angular's formGroup to connect the template
 HTML to the underlying control objects, populated from the question model with
 display and validation rules.

 formControlName and formGroup are directives defined in ReactiveFormsModule.
 The templates can access these directives directly since you imported
 ReactiveFormsModule from AppModule.*/

import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators }        from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import { QuestionBase }     from './question-base';
import { DateService }     from '../shared/date.service';

@Component({
    selector: 'app-question',
    styleUrls: ['./dynamic-form-question.component.css'],
    templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent {
    @Input() question: QuestionBase<any>;
    @Input() form: FormGroup;

    constructor(private dateService: DateService) {

    }

    minBool: boolean = false;
    maxBool: boolean = false;

    /*class Validators {
     static min(min: number): ValidatorFn
     static max(max: number): ValidatorFn
     static required(control: AbstractControl): ValidationErrors | null
     static requiredTrue(control: AbstractControl): ValidationErrors | null
     static email(control: AbstractControl): ValidationErrors | null
     static minLength(minLength: number): ValidatorFn
     static maxLength(maxLength: number): ValidatorFn
     static pattern(pattern: string | RegExp): ValidatorFn
     static nullValidator(c: AbstractControl): ValidationErrors | null
     static compose(validators: (ValidatorFn | null | undefined)[] | null): ValidatorFn | null
     static composeAsync(validators: (AsyncValidatorFn | null)[]): AsyncValidatorFn | null
     }*/

    getName(){
        this.setAttr();

        return this.question.key;
    }

    setAttr() {
        let elem = document.getElementsByName(this.question.key)[0];

        if(elem){
            if(this.question.min && !this.minBool){
                elem['min'] = this.question.min;
                this.minBool = true;
            }

            if(this.question.max && !this.maxBool){
                elem['max'] = this.question.max;
                this.maxBool = true;
            }

            //if (this.question['key'] === 'date_departure') console.info('this.question - ',this.question);
        }
    }

    getErrorName() {
        let result = null;
        const errors = this.getErrors();

        if (errors) {
            if (errors['required'])  result = 'required';
            if (errors['minlength']) result = 'minlength';
            if (errors['min'])       result = 'min';
            if (errors['max'])       result = 'max';
            if (errors['minDate'])   result = 'minDate';
            if (errors['maxDate'])   result = 'maxDate';
        }

        return result;
    }

    getErrorText(name){
        let result = '';
        let error = null;
        const errors = this.getErrors();

        if (errors && errors[name]){
            error = errors[name];
        }

        //if(!window.x) window.x = this;

        if(error) {
            if(name === 'minlength')    result = errors['requiredLength'];
            if(name === 'min')          result = errors['min']['min'];
            if(name === 'max')          result = errors['max']['max'];
            if(name === 'minDate')      result = this.dateService.MStoView(errors['requiredValue']);
            if(name === 'maxDate')      result = this.dateService.MStoView(errors['requiredValue']);
        }

        return result;
    }

    getErrors() {
        let result = null;

        try {
            result = this['form']['controls'][this.question.key]['errors'];

        } catch (error) {}

        return result;
    }
}