import {
    Component,
    Injectable,
    Input,
    Output,
    OnInit,
    EventEmitter  } from '@angular/core';

import { InteractionService }   from './interaction/interaction.service';
import { HttpClient }           from '@angular/common/http';


import { AuthService }          from './shared/auth.service';

//import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title: string = 'Incoming';
    language: string[] = ['ru', 'en'];
    activeLangs: any = {};
    showFilterButton: boolean = true;

    constructor(private interactionService: InteractionService,
                private authService: AuthService/*,
                private translate: TranslateService*/) {

        AppComponent.setDefaultMethods();

        //translate['setDefaultLang'](this.getDefaultLang());

        //interactionService.runGetFilterSubject.subscribe((data) => {window.FilterLink = data; this.showFilterButton = true});
    }

    static setDefaultMethods(){
        Array.prototype['unique'] = function() {
            var a = this.concat();
            for(var i=0; i<a.length; ++i) {
                for(var j=i+1; j<a.length; ++j) {
                    if(a[i] === a[j])
                        a.splice(j--, 1);
                }
            }

            return a;
        };

        Array.prototype['clean'] = function() {
            for (var i = 0; i < this.length; i++) {
                if (!this[i]) {
                    this.splice(i, 1);
                    i--;
                }
            }
            return this;
        };
    }


    onKey($event){
        if($event && $event.code === 'KeyA' && $event.ctrlKey){
            $event.stopPropagation();
            this.interactionService.runCtrlA();
        }
    }

    getDefaultLang(){
        let lang = 'ru';

        if(this.language && this.language[0]) lang = this.language[0];

        if(localStorage.getItem('lang') && this.language.indexOf(localStorage.getItem('lang')) !== -1) lang = localStorage.getItem('lang');

        this.setActiveLang(lang);

        return lang;
    }

    setActiveLang(lang: string){
        this.activeLangs = {};

        this.language.forEach(lg =>{
            this.activeLangs[lg] = (lg === lang) ? 'lang-selected' : 'lang-notselected';
        })
    }

    switchLanguage(lang: string) {
        if(this.language.indexOf(lang) === -1) return;

        localStorage.setItem('lang', lang);
        this.setActiveLang(lang);
        //this.translate.use(lang);
    }

}
