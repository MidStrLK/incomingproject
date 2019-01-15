
import { Component } from '@angular/core'
import { HttpClient} from '@angular/common/http';

import { InteractionService }   from '../../interaction/interaction.service';
import { environment }          from '../../../environments/environment';
import { AuthService }          from '../../shared/auth.service';
import { StatusService }        from '../../shared/status.service';

@Component({
    selector: 'userbutton-place',
    templateUrl: './userbutton.component.html',
    styleUrls: ['./userbutton.component.css']
})
export class UserButtonPlaceComponent {
    status: any = {};
    is_open_window: boolean = false;
    userbuttonHover:boolean = false;

    constructor(private  auth: AuthService,
                private  statusS: StatusService,
                private  interaction: InteractionService){

        statusS.getStatus(data => this.status = data);
    }

    onButtonClick(){
        this.interaction.runShowCentralPanelInfo();
        this.closeModalWindow();
    }

    onButtonHover(){
        this.openModalWindow();
    }

    closeModalWindow(){
        this.is_open_window = false;
        this.userbuttonHover = false;
    }

    openModalWindow(){
        this.is_open_window = true;
        this.userbuttonHover = true;
    }

    onExitClick(){
        this.auth.logout();
    }
}
