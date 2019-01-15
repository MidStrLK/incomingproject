import { Component, Injectable }         from '@angular/core';

import { InteractionService }      from '../interaction/interaction.service';
import { ModalInteractionService }      from '../interaction/modal.service';

@Component({
    selector: 'loadmsg_place',
    templateUrl: './loadmsg.component.html',
    styleUrls: ['./loadmsg.component.css']
})

export class LoadMsg{
    is_open_window: boolean = false;
    urlsArray: string[] = [];
    timer = null;
    timerTime: number = 10;
    timerObject: {} = {};


    constructor(private interactionService: InteractionService,
                private modalService: ModalInteractionService) {
        modalService.runShowLoadingSubject['subscribe'](a => this.showLoading(a));
        modalService.runHideLoadingSubject['subscribe'](a => this.hideLoading(a));
    }

    private startTimer(url){
        if(!this.timerObject[url]){
            this.timerObject[url] = setTimeout(()=>this.closeLoading(url), this.timerTime*1000);
        }
    }

    private stopTimer(url){
        if(this.timerObject[url]){
            clearTimeout(this.timerObject[url]);
            delete this.timerObject[url];
        }
    }

    private closeLoading(url){
        const keys = Object.keys(this.timerObject);
        if(keys && keys.length && keys.length === 1 && this.timerObject[url]){
            this.stopTimer(url);
        }
    }

    public showLoading(url){
        if(url && typeof url === 'string') this.urlsArray.push(url);
        this.startTimer(url);
    }

    public hideLoading(url){
        if(url && this.urlsArray && this.urlsArray.indexOf && (this.urlsArray.indexOf(url) !== -1)){
            this.urlsArray.splice(this.urlsArray.indexOf(url), 1);
            this.stopTimer(url);
        }
    }

    /* Открыть окно */
    openModalWindow(){
        this.is_open_window = true;
    }

    /* Закрыть окно */
    closeModalWindow($event, notClose) {
        this.is_open_window = false;
    }
}