import { Component, AfterViewInit } from '@angular/core'

import { InteractionService }      from '../../interaction/interaction.service';
import { ModalInteractionService } from '../../interaction/modal.service';
import { RequestService }          from '../../shared/request.service';
import { ElementsService }         from '../../shared/elements.service';


@Component({
    moduleId: module.id.toString(),
    selector: 'filter-input-place',
    templateUrl: './filter_input.component.html',
    styleUrls: ['./filter_input.component.css']
})

export class FilterInputPlaceComponent{
    showFilterButton: boolean = false;
    questions: any[];
    modal_window_type: string = 'filter_input';
    placeholder: string = 'фильтры';
    input_value: string = '';
    isButtonEnabled:boolean = false;
    isClearButtonDisabled:boolean = false;
    clear_input_button_top:boolean = false;
    filter_input_top:boolean = false;

    constructor(private interactionService:  InteractionService,
                private modalService:  ModalInteractionService,
                private request: RequestService,
                private elements: ElementsService) {
        interactionService.runGetFilterSubject['subscribe'](data => this.getFilter(data));
        modalService.runFilterGetValuesSubject['subscribe'](a => this.submitValues(a));
        modalService.runAfterCloseWindowSubject['subscribe'](a => this.afterCloseModal(a));
        modalService.runReturnGetValuesSubject['subscribe'](a => this.returnGetValues(a));
        //interactionService.runClearAllSubject.subscribe(() => this.clearFilter());
    }

    onClearInputClick($event){
        this.input_value = '';
        this.isButtonEnabled = false;
        //this.isClearButtonDisabled = true;
    }

    ngAfterViewInit(){
        this.modalService.runSetWindowPosition(this.modal_window_type);
    }

    onKey($event){
        if($event.key === 'Enter') this.onFilterButtonClick();

        //this.isClearButtonDisabled = !this.input_value;
    }

    returnGetValues(a){
        const type = a.type;
        const data = a.data;
        const values = a.values;

        if(type !== this.modal_window_type) return;

        this.placeholder = JSON.stringify(data).replace(/{|}|"/g, '').replace(/,/g, ', ').replace(/true/g, 'да').replace(/false/g, 'нет');

        this.submitValues(values);
    }

    submitValues(data) {
        console.info('submitValues - ',data);
        // Регулярное выражение одобрено Вячеславом Куракиным
        if (data &&
           ((typeof data === 'string' && data.replace(/\s/g, '')) ||
           (data instanceof Object))
        ) {
            this.request.setFilterData(data);
        }
    }
    
    /* Получает поля фильтра с сервера */
    getFilter(link){
        this.request.getFilter((data => {
            this.setFilter(data);
            //this.setFilter(this.addTest(data));
        }), link);
    }

    addTest(data){
        if(data && data[0] && data[0]['filters'] && data[0]['filters'] instanceof Array){

            data[0]['filters'].push({
                fieldType: "textfield",
                label: "Тест валидации",
                name: "validtest",
                type: "text",
                value: "test",
                visible: "true",
                required: true,
                minLength: 11
            });

            data[0]['filters'].push({
                fieldType: "numberfield",
                label: "Число",
                name: "number",
                type: "number",
                value: "1122",
                visible: "true",
                min: 1,
                max: 15
            });

            data[0]['filters'].push({
                fieldType: "textarea",
                label: "textarea",
                name: "textarea",
                type: "string",
                value: "area",
                visible: "true"
            });

            data[0]['filters'].push({
                fieldType: "date",
                label: "date",
                name: "date",
                //value: '2017-01-02',
                visible: "true",
                minDate: '2018-03-18',
                maxDate: '2018-03-21'
            });

            data[0]['filters'].push({
                fieldType: "checkbox",
                label: "Чекбокс",
                name: "check",
                value: true,
                visible: "true"
            });
        }


        return data;
    }

    /* Вставляет поля в окно и показывает кнопку фльтра */
    setFilter(data){
        this.questions = this.elements.generateQuestions(data, 'filter');
        this.showFilterButton = true;
    }

    /* При клике на кнопку фильтра показывает окно фильтра */
    onFilterButtonClick(){
        //this.modalService.openWindow(this.modal_window_type);

        if(this.isButtonDisabled()){
            this.onFilterInputClick();
        }else{
            if(this.input_value){
                this.submitValues(this.input_value);
            }else{
                this.modalService.getClearValues(this.modal_window_type);
            }
        }
    }

    onFilterInputClick(){
        this.modalService.openWindow(this.modal_window_type);
        this.filter_input_top = true;
        this.clear_input_button_top = true;
        this.isButtonEnabled = true;
    }

    isButtonDisabled(){
        return !this.isButtonEnabled;
    }

    afterCloseModal(type){
        if(type === this.modal_window_type){
            this.filter_input_top = false;
            this.clear_input_button_top = false;
            this.isButtonEnabled = !!this.input_value;
        }
    }

    /*clearFilter(){
        this.showFilterButton = false;
        this.open_filter_modal_window = false;
    }*/


}
