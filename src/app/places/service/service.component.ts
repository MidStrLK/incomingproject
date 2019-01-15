import { Component } from '@angular/core'

import { InteractionService }      from '../../interaction/interaction.service';
import { ModalInteractionService } from '../../interaction/modal.service';
import { RequestService }          from '../../shared/request.service';
import { ElementsService }         from '../../shared/elements.service';


@Component({
    moduleId: module.id.toString(),
    selector: 'service-button-place',
    templateUrl: './service.component.html',
    styleUrls: ['./service.component.css']
})


export class ServicePlaceComponent{
    showServiceButton: boolean = false;
    questions: any[];
    modal_window_type: string = 'service';
    showContextMenu:    boolean = false;
    contextMenuStyle:   any = {};
    is_open_window: boolean = false;
    services: any[] = [];

    constructor(private interactionService:  InteractionService,
                private modalService:  ModalInteractionService,
                private request: RequestService,
                private elements: ElementsService) {
        interactionService.runGetServiceSubject['subscribe'](data => this.getService(data));
        interactionService.runServiceMenuSubject['subscribe'](data => this.showMenu(data));
    }

    rightClick($event){
        console.info('rightClick - ');
        $event.stopPropagation();
        $event.preventDefault();

        this.closeModalWindow(null);

        let x = $event.clientX, y = $event.clientY,
            elementMouseIsOver = document.elementFromPoint(x, y);

        let count = 0;
        let me = this;
        let interval = setInterval(function(){
            count++;
            if(count>20 || (elementMouseIsOver.className.indexOf('modal') === -1)) {
                clearInterval(interval);
                me.interactionService.runGridRightClick($event);
            }
        }, 10);

        //this.interactionService.runGridRightClick($event);
    }

    closeModalWindow($event){
        if($event && $event.stopPropagation) $event.stopPropagation();
        if($event && $event.preventDefault) $event.preventDefault();
        this.is_open_window = false;
    }

    clickPanel($event){
        $event.stopPropagation();
    }

    showMenu(coord){
        this.is_open_window = true;

        this.showContextMenu = true;

        this.contextMenuStyle = {
            'left': coord.x + 'px',
            'top':  coord.y + 'px'
        };
    }

    submitValues(data){
        /*if(!a || !a.type || !a.data) return;

         const type = a.type;
         let data = a.data;

         if(type !== this.modal_window_type) return;*/

        console.info('FILTER - ',data);
    }

    /* Получает поля фильтра с сервера */
    getService(link){
        this.request.getService((data => {
            this.services = data;
        }), link);
    }

    /* При клике на кнопку фильтра показывает окно фильтра */
    onServiceClick($event, serv){
        $event.stopPropagation();
        this.interactionService.runService(serv);
    }


}
