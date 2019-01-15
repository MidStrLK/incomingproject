import { Component, Input, OnInit, DoCheck }         from '@angular/core';
import { ModalInteractionService }  from '../interaction/modal.service';
import { QuestionBase }             from '../dynamic-form/question-base';

@Component({
    selector: 'modal_window',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})

export class ModalWindow implements DoCheck{
    @Input() modal_window_type: string;
    @Input() questions: QuestionBase<any>[] = [];

    is_open_window:boolean = false;
    modalclass: string = 'modalclass-hide';

    isQuestionsReady: {} = {};

    constructor(private modalService:  ModalInteractionService) {
        modalService.runOpenWindowSubject['subscribe']((a) => this.openModalWindow(a));
        modalService.runEditWindowSubject['subscribe']((a) => this.editModalWindow(a));
        //modalService.runSetWindowPositionSubject['subscribe']((a) => this.setWindowPosition(a));
        modalService.runCloseWindowSubject['subscribe']((a) => this.closeModalWindow(a, false));
    }

    ngDoCheck() {
        if(!this.isQuestionsReady[this.modal_window_type] && this.questions){
            this.onQuestionReady();
            this.isQuestionsReady[this.modal_window_type] = true;

            //this.setWindowPosition(this.modal_window_type);
        }
    }

    /*setWindowPosition(type){
        if(!this.testType(type)) return;
        const parameters = this.getParentButtonPosition(type);

        console.info('parameters - ',parameters);
    }*/

    /*getParentButtonPosition(type){
        let res = null;
        const buttonClass: string = type + '-button';
        const elems = document.getElementsByTagName(buttonClass);
        const windowWidth = document.documentElement.clientWidth;

        if(!elems || !elems.length) return;

        const elem = elems[0];

        if(elem && elem.getBoundingClientRect){
            res = elem.getBoundingClientRect();
            res['right'] = windowWidth - res['x'];
        }

        return res;
    }*/

    onQuestionReady(){
        this.is_open_window = true;
    }

    editModalWindow(obj){
        let type = obj.type;
        let data = obj.data;

        if(!this.testType(type) || !data) return;

        if(data && data[0]) data = data[0];

        if(data && data instanceof Object){
            this.openModalWindow(type);
            this.modalService.setValues(type, data);
        }
    }

    /* Открыть окно */
    openModalWindow(type){
        if(!this.testType(type)) return;
        this.is_open_window = true;  //!this.is_open_window;
        this.modalclass = 'modalclass-' + ((this.modalclass !== 'modalclass-hide' && type !== 'filter_input') ? 'hide' : 'show');
    }

    /* Закрыть окно */
    closeModalWindow($event, notClose){
        if(typeof $event === 'object'){
            $event.stopPropagation();
        }else{
            if(!this.testType($event)) return;
        }

        if(!notClose) {
            //this.is_open_window = false;
            this.modalclass = 'modalclass-hide';
            this.modalService.runAfterCloseWindow(this.modal_window_type);
        }
    }


    /* Проверка типа эдитора */
    private testType(type){
        return type === this.modal_window_type;
    }
}