
import { Component, OnInit } from '@angular/core'
import { HttpClient} from '@angular/common/http';

import { InteractionService }      from '../../interaction/interaction.service';
import { RequestService }      from '../../shared/request.service';

import {trigger, transition, style, animate, state} from '@angular/animations'

@Component({
    selector: 'tab-place',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.css'],
    animations: [
        trigger(
            'myAnimation',
            [
                transition(
                    ':enter', [
                        style({opacity: 0}),
                        animate('150ms', style({'opacity': 1}))
                    ]
                ),
                transition(
                    ':leave', [
                        style({'opacity': 1}),
                        animate('150ms', style({'opacity': 0}))

                    ]
                )]
        )
    ]
})


export class TabPlaceComponent {
    tabItems: any[] = [];
    selectedTabItem: string = '';
    selectedTabItemName: string = 'name';
    gridLink: string = '';

    constructor(private interactionService:  InteractionService,
                private request: RequestService){
        interactionService.runGetTabPanelSubject.subscribe(data => this.getTab(data));
        interactionService.runClearAllSubject.subscribe(() => this.clearAll());
    }

    getTabStyle(item){
        if(item[this.selectedTabItemName] === this.selectedTabItem) {
            return "#3e3436";
        } else {
            return "";
        }
    }

    getTab(link){
        this.gridLink = link;

        this.request.getTabPanel((data => this.setTab(data)), link);
    }

    setTab(data){
        if(data && data instanceof Array){
            this.tabItems = data;
            this.selectTab(0);
        }
    }

    selectTab(number){
        if(number !== undefined && this.tabItems && this.tabItems[number]){
            this.onClickTabButton(this.tabItems[number])
        }
    }

    onClickTabButton(item){
        this.selectedTabItem = item.name;
        this.getTabStyle(item);
        this.interactionService.runCreateEditor(item);
        this.interactionService.runGetMainData(item, this.gridLink);
    }

    clearAll(){
        this.tabItems = [];
        this.selectedTabItem = '';
    }
}
