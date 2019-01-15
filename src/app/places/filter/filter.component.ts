import { Component, AfterViewInit } from '@angular/core'

import { InteractionService }      from '../../interaction/interaction.service';
import { ModalInteractionService } from '../../interaction/modal.service';
import { RequestService }          from '../../shared/request.service';
import { ElementsService }         from '../../shared/elements.service';


@Component({
    moduleId: module.id.toString(),
    selector: 'filter-button-place',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
})
export class FilterPlaceComponent{
    showFilterButton: boolean = false;
    questions: any[];
    modal_window_type: string = 'filter';

    constructor(private interactionService:  InteractionService,
                private modalService:  ModalInteractionService,
                private request: RequestService,
                private elements: ElementsService) {
        interactionService.runGetFilterSubject['subscribe'](data => this.getFilter(data));
        modalService.runFilterGetValuesSubject['subscribe'](a => this.submitValues(a));
        //interactionService.runClearAllSubject.subscribe(() => this.clearFilter());
    }

    ngAfterViewInit(){
        this.modalService.runSetWindowPosition(this.modal_window_type);
    }

    submitValues(data){
        /*if(!a || !a.type || !a.data) return;
        
        const type = a.type;
        let data = a.data;
        
        if(type !== this.modal_window_type) return;*/

        console.info('FILTER - ',data);
    }
    
    /* Получает поля фильтра с сервера */
    getFilter(link){
        this.request.getFilter((data => {
            this.setFilter(this.addTest(data), true);
        }), link);
    }

    addTest(data){
        return data;
    }

    /* Вставляет поля в окно и показывает кнопку фльтра */
    setFilter(data, second){
        this.questions = this.elements.generateQuestions(data, 'filter');
        this.showFilterButton = true;
    }

    /* При клике на кнопку фильтра показывает окно фильтра */
    onFilterButtonClick(){
        this.modalService.openWindow(this.modal_window_type);
    }


    /*clearFilter(){
        this.showFilterButton = false;
        this.open_filter_modal_window = false;
    }*/


}
