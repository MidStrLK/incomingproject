
import { Component, Input } from '@angular/core'

import { RequestService }   from '../../shared/request.service';
import { AuthService }      from '../../shared/auth.service';

@Component({
    selector: 'auth-place',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthPlaceComponent {
    data: {} = {
        login: '',
        password: ''
    };
    error_text = 'error!!!!';
    isError: boolean = false;
    defaultErrorText: string = 'Не правильно введен логин или пароль';
    savelogin:boolean = false;

    constructor(private request:  RequestService,
                private auth:  AuthService){
        const login = this.getLogin();

        if(login){
            this.data['login'] = login;
            this.savelogin = true;
        }
    }

    onSubmit(){
        this.setLogin();
        //this.request.login((a) => this.failureLogin(a), this.data, (a) => this.successLogin(a));
        this.request.login((a) => this.successLogin(a), this.data, (a) => this.failureLogin(a));
    }

    getLogin(){
        return localStorage.getItem('login');
    }

    setLogin(){
        console.info('this.savelogin - ',this.savelogin);
        if(this.savelogin && this.data['login']) localStorage.setItem('login', this.data['login']);
    }

    successLogin(msg){
        if(msg && msg['token']){
            this.auth.login(msg['token']);
        }
    }

    failureLogin(err){
        console.info('err - ',err);
        this.showError((err && err.error && err.error.error) ? err.error.error : this.defaultErrorText);
    }

    get isValid(){
        return (this.data && this.data['login'] && this.data['password']);
    }

    showError(text){
        this.error_text = text;
        this.isError = true;
    }

}
