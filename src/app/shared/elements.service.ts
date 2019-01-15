import { Injectable, ViewChild }            from '@angular/core';
import { Subject }                          from 'rxjs/Subject';
import {FormControl} from '@angular/forms';

import { DropdownQuestion } from '../dynamic-form/question-dropdown';
import { QuestionBase }     from '../dynamic-form/question-base';
import { TextboxQuestion }  from '../dynamic-form/question-textbox';
import { NumberfieldQuestion }  from '../dynamic-form/question-numberfield';
import { CheckboxQuestion }  from '../dynamic-form/question-checkbox';
import { TextareaQuestion }  from '../dynamic-form/question-textarea';
import { DateQuestion }  from '../dynamic-form/question-date';

@Injectable()

export class ElementsService {

    public generateQuestions(data, type) {
        let result:any[] = [];
        const isFilter = Boolean(type === 'filter');

        data.forEach(item => {
            if (item['filters']) {
                result = result.concat(this.generateQuestions(item['filters'], type))
            } else {
                const elem = this.createElement(item, isFilter);
                if (elem) result.push(elem)
            }


        });

        return result;
    }

    private createElement(item, isFilter) {
        let result:any;

        switch (item['fieldType']) {
            case 'textfield':
                result = this.createTextfield(item, isFilter);
                break;
            case 'combobox':
                result = this.createCombobox(item, isFilter);
                break;
            case 'numberfield':
                result = this.createNumberfield(item, isFilter);
                break;
            case 'checkbox':
                result = this.createCheckbox(item, isFilter);
                break;
            case 'textarea':
                result = this.createTextarea(item, isFilter);
                break;
            case 'date':
                result = this.createDatefield(item, isFilter);
                break;
            default:
                result = null;
        }

        return result;
    }



    private createTextfield(item, isFilter) {
        return new TextboxQuestion({
            key:        item.name,
            label:      item.label,
            value:      item.value,
            required:  (item.required && !isFilter),
            minLength:  item.minLength,
            maxLength:  item.maxLength
        });
    }

    private createNumberfield(item, isFilter) {
        return new NumberfieldQuestion({
            key:        item.name,
            label:      item.label,
            value:      item.value,
            required:  (item.required && !isFilter),
            min:        item.min,
            max:        item.max
        });
    }

    private createCheckbox(item, isFilter) {
        return new CheckboxQuestion({
            key:    item.name,
            label:  item.label,
            value:  item.value
        });
    }

    private createDatefield(item, isFilter) {
        console.info('item.minDate - ',item.minDate);

        return new DateQuestion({
            key:        item.name,
            label:      item.label,
            value:      item.value,
            required:  (item.required && !isFilter),
            minDate:    new Date(item.minDate).getTime(),
            maxDate:    new Date(item.maxDate).getTime()
        });

    }

    private createCombobox(item, isFilter) {

        if(!item || !item.data || !item.data.forEach) return null;

        return new DropdownQuestion({
            key:        item.name,
            label:      item.label,
            value:      item.value,
            required:  (item.required && !isFilter),
            options:    this.createComboboxOptions(item.data)
        });
    }

    private createComboboxOptions(data) {
        let result:any[] = [];

        data.forEach(item => {
            result.push({
                value: item.name,
                key: parseInt(item.id)
            })
        });

        return result;
    }












    private createTextarea(item, isFilter) {
        /*fieldType:"textfield"
         label:"Название"
         name:"name"
         required:"false"
         type:"string"
         visible:"true"*/

        return new TextareaQuestion({
            key: item.name,
            label: item.label,
            value: item.value
        });
    }









}