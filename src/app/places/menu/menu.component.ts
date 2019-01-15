
import { Component, OnInit } from '@angular/core'
import { HttpClient} from '@angular/common/http';

import { InteractionService }      from '../../interaction/interaction.service';
import { RequestService }      from '../../shared/request.service';

@Component({
    selector: 'menu-place',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})


export class MenuPlaceComponent {
    menuItems: any[] = [];
    selectedMenuItem: string = '';
    selectedMenuItemName: string = 'name';
    menuItemsClass: string[] = [];

    constructor(private interactionService:  InteractionService,
                private request: RequestService){

        interactionService.runChangeCurrentLanguageSubject['subscribe'](() => this.getMenu());
    }


    ngOnInit(){
        this.getMenu();
    }

    getMenu(){
        this.request.getMainMenu(data => this.setMenu(data));
    }

    setMenu(data){

        data = this.uglifyNames(data);

        if(data && (data instanceof Array)) this.menuItems = data;
    }

    uglifyNames(data){
        let i: number = 0;

        return data.map(item => {
            item['name'] = item.name + String(i++);
            if(item.items){
                item['items'] = this.uglifyNames(item['items']);
            }
            return item;
        });
    }

    getMenuItemClass(item){
        console.info('item - ',item);
        return 'qwerty'
    }

    onMenuItemClick(item, parent){
        if(!item['link']) return;

        this.selectedMenuItem = parent ? parent[this.selectedMenuItemName] : item[this.selectedMenuItemName];

        this.interactionService.runMenuClick(item);
    }

    getMenuItemStyle(item){
        if(item[this.selectedMenuItemName] === this.selectedMenuItem) {
            return "#ebebeb";
        } else {
            return "";
        }
    }

}
