import { Injectable, ViewChild }    from '@angular/core';
import { Subject }                  from 'rxjs/Subject';

import { InteractionService }           from '../interaction/interaction.service'

@Injectable()
export class AuthService {
    authenticat: boolean = false;

    constructor(private interaction: InteractionService){

    }

    static getToken(): string {
        return localStorage.getItem('token') || '';
    }

    static setToken(token){
        localStorage.setItem('token', token);
    }

    login(token){
        AuthService.setToken(token);

        this.authenticat = true;
    }

    logout(){
        this.interaction.logout();

        AuthService.setToken('');

        this.authenticat = false;
    }

    reLogin(){
        this.authenticat = false;
        localStorage.removeItem('token');
    }

    get authenticated(){
        return Boolean(AuthService.getToken());
    }
}