/*The following QuestionBase is a fundamental question class.*/

export class QuestionBase<T>{
    value:          T;
    key:            string;
    label:          string;
    order:          number;
    controlType:    string;

    required:       boolean;
    min:            number;
    max:            number;
    minDate:        string;
    maxDate:        string;
    minLength:      number;
    maxLength:      number;

    constructor(options: {
        value?:         T,
        key?:           string,
        label?:         string,
        order?:         number,
        controlType?:   string,

        required?:      boolean,
        min?:           number,
        max?:           number,
        minDate?:       string,
        maxDate?:       string,
        minLength?:     number,
        maxLength?:     number

    } = {}) {
        this.value          = options.value;
        this.key            = options.key || '';
        this.label          = options.label || '';
        this.order          = options.order === undefined ? 1 : options.order;
        this.controlType    = options.controlType || '';
        this.required       = !!options.required;
        this.min            = options.min || undefined;
        this.max            = options.max || undefined;
        this.minDate        = options.minDate || '';
        this.maxDate        = options.maxDate || '';
        this.minLength      = options.minLength || undefined;
        this.maxLength      = options.maxLength || undefined;
    }
}