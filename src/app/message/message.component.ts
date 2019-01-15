import { Component }         from '@angular/core';

import { InteractionService }      from '../interaction/interaction.service';

@Component({
    selector: 'message_window',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})

export class MessageWindow{
    is_open_window: boolean = false;
    modalclass: string = 'modalclass-hide';
    type: string = 'alert';
    header: string = 'Ошибка сети';
    text: string = '';

    messages: any[] = [];

    constructor(private interactionService: InteractionService) {
        interactionService.runShowMessageSubject['subscribe'](data => this.showMessage(data));
    }

    okFunction(){

    }

    closeFunction(){

    }

    showMessage(data){
        /*console.info('data.text - ', data.text);
        console.info('this.text - ', this.text);*/

        if(!data || !data.type || !data.text) return;

        this.messages.push({
            text:  (data.text   || this.text).replace(/<\/?[^>]+>/g,''),
            header: data.header || this.header,

        });


        /*if(data.type)           this.type           = data.type;
        if(data.header)         this.header         = data.header;
        if(data.text)           this.text           = data.text.replace(/<\/?[^>]+>/g,'');
        if(data.okFunction)     this.okFunction     = data.okFunction;
        if(data.closeFunction)  this.closeFunction  = data.closeFunction;*/

        this.openModalWindow();
    }

    /* Открыть окно */
    openModalWindow(){
        this.is_open_window = true;  //!this.is_open_window;
        this.modalclass = 'modalclass-show';
    }

    /* Закрыть окно */
    closeModalWindow($event, notClose){
        $event.stopPropagation();

        if(!notClose) {
            //this.is_open_window = false;
            this.modalclass = 'modalclass-hide';
        }

        this.messages = [];
    }
}