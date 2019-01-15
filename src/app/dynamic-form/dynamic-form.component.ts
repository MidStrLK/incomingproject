/*Now that you have defined the complete model you are ready to
create components to represent the dynamic form.

 DynamicFormComponent is the entry point and the main container for the form.*/
import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';

import { QuestionBase }              from './question-base';
import { QuestionControlService }    from './question-control.service';

import { InteractionService }        from '../interaction/interaction.service';
import { ModalInteractionService }   from '../interaction/modal.service';

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.css'],
    providers: [ QuestionControlService ]
})
export class DynamicFormComponent implements OnInit {
    @Input() questions: QuestionBase<any>[] = [];
    @Input() modal_window_type: string;
    form: FormGroup;
    payLoad = '';
    values: {} = {};
    show_apply_button: boolean = false;
    show_close_button: boolean = false;
    show_clear_button: boolean = false;

    constructor(private interactionService:  InteractionService,
                private qcs: QuestionControlService,
                private modalService: ModalInteractionService) {
        modalService.runSetValuesSubject.subscribe((a) => this.setValues(a));
        modalService.runGetClearValuesSubject.subscribe((a) => this.getClearValues(a));
    }

    closeModalWindow(){
        this.modalService.closeWindow(this.modal_window_type);

        if(this.modal_window_type === 'editor'){
            this.modalService.runUnlock();
        }

    }

    setValues(a){
        let type: string = a.type;
        let data: {} = a.data;

        if(!type || !this.testType(type)) return;

        this.form['patchValue'](data);
    }

    getClearValues(type){
        if(!this.testType(type)) return;

        let values = this.form['value'];
        let res = {};
        let vals = {};

        for(let val in values){
            if(values[val]) {
                this.questions.forEach((item) => {

                    if(item.key === val) {
                        if(item['options'] && item['options'].forEach){
                            item['options'].forEach(opt =>{
                                if(opt.key === values[val]){
                                    res[item.label] = opt.value;
                                    vals[item.key] = opt.value;
                                }
                            })
                        }else{
                            res[item.label] = values[val];
                            vals[item.key] = values[val];
                        }
                    }
                });

            }
        }

        this.modalService.returnGetValues(type, res, vals);
    }

    getValues(type){
        if(this.testType(type)) this.modalService.returnGetValues(type, this.form['value'], null);
    }

    ngOnInit() {
        this.form = this.qcs.toFormGroup(this.questions);

        this.values = this.form['value'];

        this.showButtons();
    }

    showButtons(){
        const type = this.modal_window_type;

        this.show_apply_button = (type === 'editor' || type === 'filter');
        this.show_close_button = (type === 'editor');
        this.show_clear_button = (type === 'filter');
    }

    onSubmit() {
        const values = this.form['value'];
        this.payLoad = JSON.stringify(values);

        this.modalService.getValues(this.modal_window_type, values);
    }

    onButtonClearClick(){
        for(let name in this.form['controls']){
            if(name && this.values[name] !== undefined){
                this.form['controls'][name]['setValue'](this.values[name]);
            }
        }
    }

    /* Проверка типа эдитора */
    private testType(type){
        return type === this.modal_window_type;
    }
}