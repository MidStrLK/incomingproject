/*From this base you can derive two new classes in TextboxQuestion and DropdownQuestion
 that represent textbox and dropdown questions. The idea is that the form will be bound
 to specific question types and render the appropriate controls dynamically.

 DropdownQuestion presents a list of choices in a select box.*/

import { QuestionBase } from './question-base';

export class DropdownQuestion extends QuestionBase<string> {
    controlType = 'dropdown';
    options: {key: string, value: string}[] = [];

    constructor(options: {} = {}) {
        super(options);
        this.options = options['options'] || [];
    }
}