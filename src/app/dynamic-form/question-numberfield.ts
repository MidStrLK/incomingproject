/*From this base you can derive two new classes in TextboxQuestion and DropdownQuestion
that represent textbox and dropdown questions. The idea is that the form will be bound
to specific question types and render the appropriate controls dynamically.

 TextboxQuestion supports multiple HTML5 types such as text, email, and url via the type property.*/

import { QuestionBase } from './question-base';

export class NumberfieldQuestion extends QuestionBase<string> {
    controlType = 'numberfield';
    type: string;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
    }
}