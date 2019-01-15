
import { Component } from '@angular/core'
import { HttpClient} from '@angular/common/http';

import { InteractionService }      from '../../interaction/interaction.service';

@Component({
    selector: 'summary-place',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryPlaceComponent {

    constructor(private interactionService:  InteractionService,
                private  http: HttpClient){}

}
