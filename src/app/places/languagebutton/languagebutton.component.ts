
import { Component } from '@angular/core'
import { HttpClient} from '@angular/common/http';

import { InteractionService }   from '../../interaction/interaction.service';
import { environment }          from '../../../environments/environment';

@Component({
    selector: 'languagebutton-place',
    templateUrl: './languagebutton.component.html',
    styleUrls: ['./languagebutton.component.css']
})
export class LanguagebuttonPlaceComponent {
    showButton: boolean = false;
    languages: string[] = [];
    currentLanguage: string = '';

    constructor(private interactionService:  InteractionService,
                private  http: HttpClient){
        this.showButton = (environment && environment.useLangusges);

        if(environment && environment.languages && environment.languages instanceof Array){
            this.languages = environment.languages;
        }

        if(this.languages && this.languages[0] && typeof this.languages[0] === 'string'){
            this.currentLanguage = this.languages[0];
        }
    }


    onButtonClick(){
        const currentLangPos = this.languages.indexOf(this.currentLanguage);

        if(currentLangPos === this.languages.length - 1){
            this.currentLanguage = this.languages[0];
        }else{
            this.currentLanguage = this.languages[currentLangPos + 1];
        }

        this.interactionService.runChangeCurrentLanguage(this.currentLanguage);
    }
}
