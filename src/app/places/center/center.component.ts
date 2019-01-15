import { Component }    from '@angular/core';
import { InteractionService }       from '../../interaction/interaction.service';

@Component({
    selector:      'center-place',
    templateUrl: './center.component.html',
    styleUrls:  ['./center.component.css']
})

export class CenterPlaceComponent {
    showCenterGrid:boolean = false;

    constructor(private interactionService:InteractionService) {
        interactionService.runShowCenterSubject['subscribe'](() => this.showGrid());
        interactionService.runShowCentralPanelInfoSubject['subscribe'](() => this.showInfo());
    }

    showGrid(){
        this.showCenterGrid = true;
    }

    showInfo(){
        this.showCenterGrid = false;
    }
}