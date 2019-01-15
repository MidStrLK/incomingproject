/**
 * Created by eds on 26.12.2017.
 */
import { Component, Injectable }    from '@angular/core'
import { HttpClient }               from '@angular/common/http';

import { environment }              from '../../environments/environment';
import { InteractionService }       from '../interaction/interaction.service';
import { ModalInteractionService }  from '../interaction/modal.service';
import { AuthService }              from './auth.service';
//import { CenterPlaceComponent }       from '../places/center/center.component';

@Injectable()
export class RequestService {
    currentLanguage: string = '';
    sortParameter: string = '';
    sortName: string = '';
    sortDirection: string = '';
    filterData: any = '';

    constructor(private  http: HttpClient,
                private  interaction: InteractionService,
                private  authService: AuthService,
                private  modalService: ModalInteractionService){

        if( environment &&
            environment.languages &&
            environment.languages instanceof Array &&
            environment.languages[0] &&
            typeof environment.languages[0] === 'string'
        ){
            this.currentLanguage = environment.languages[0];

            interaction.runChangeCurrentLanguageSubject['subscribe'](a => this.changeCurrentLanguage(a));
            interaction.runLogoutSubject['subscribe'](() => this.logout());
        }
    }


    /*----- G E T T E R S -----*/


    public getStatus(callback){
        this.submitRequest({
            url: this.createLink('status', false, ''),
            callback: callback
        });
    }

    /* ПОЛУЧИТЬ ГЛАВНОЕ МЕНЮ */
    public getMainMenu(callback){
        this.submitRequest({
            url: this.createLink('main_menu', false, ''),
            callback: callback
        });

    }

    /* ПОЛУЧИТЬ ПАНЕЛЬ ТАБОВ */
    public getTabPanel(callback, link) {
        this.submitRequest({
            url: this.createLink(link, true, 'tabpanel'),
            callback: callback
        });
    }

    /* ПОЛУЧИТЬ ФИЛЬТРЫ */
    public getFilter(callback, link){
        this.submitRequest({
            url: this.createLink(link, true, 'filters'),
            callback: callback
        });
    }

    /* ПОЛУЧИТЬ СЕРВИСЫ */
    public getService(callback, link){
        this.submitRequest({
            url: this.createLink(link, true, 'service'),
            callback: callback
        });
    }

    /* ПОЛУЧИТЬ ЗНАЧЕНИЯ ДЛЯ ЦЕНТРАЛЬНОГО ГРИДА */
    public getMainData(callback, link){
        this.submitRequest({
            url: this.createLink(link, true, 'getmaindata'),
            callback: callback
        });
    }

    /* ПОЛУЧИТЬ ДАННЫЕ ДЛЯ ОТОБРАЖЕНИЯ В ЭДИТОРЕ */
    public getEditorData(callback, id, link){
        this.submitRequest({
            url: this.createLink(link + '/' + id + '/lock', true, 'editor'),
            callback: callback
        });
    }

    public unlock(id, link) {
        this.submitRequest({
            url: this.createLink(link + '/' + id + '/unlock', true, 'editor')
        });
    }

    public logout() {
        this.submitRequest({
            url: this.createLink('logout', false, null)
        });
    }

    /*----- S E T T E R S -----*/

    /* ОТПРАВИТЬ ДАННЫЕ ЭДИТОРА */
    public postEditorData(callback, id, data, link){
        this.submitRequest({
            url: this.createLink(link + '/' + id, true, 'editor'),
            data: data,
            callback: callback
        });
    }

    /* ОТПРАВИТЬ ДЕЙСТВИЕ СЕРВИСА */
    public postService(data){

        if(!data || !data.handler || !data.ids || !data.link) return;

        this.submitRequest({
            url: this.createLink(data.link + '/' + data.handler, true, null),
            data: data.ids,
            callback: data.callback
        });
    }


    public login(callback, data, failure){
        this.submitRequest({
            url: this.createLink('login', false, null),
            data: data,
            callback: callback,
            failure: failure
        });
    }




    /*----- C O M M O N -----*/

    /* ОСУЩЕСТВЛЯЕТ ПРОВЕРКУ ДАННЫХ И ОТПРАВКУ ЗАПРОСА */
    private submitRequest(opt) {
        if (!opt || !opt.url) return;

        let me = this;
        const url = opt.url;
        let method = (opt.method && (opt.method === 'post' || opt.method === 'delete')) ? opt.method : 'get';
        const callback = (opt.callback && typeof opt.callback === 'function') ? opt.callback : function (a) {
            console.log('CALLBACK', a);
        };
        const data = opt.data || null;

        if (data && method === 'get') method = 'post';

        const successFunc = function(data){
            me.modalService.hideLoading(url);
            callback(data);
        };


        const failureFunc = function(err){
            me.modalService.hideLoading(url);

            if(opt.failure && typeof opt.failure === 'function'){
                opt.failure(err);
            }else{
                if(err && err.status === 401){
                    me.authService.reLogin();
                }else if(err && err.status === 200){
                    me.authService.reLogin();
                }else if(err && err.status === 404){
                    callback({
                        username: 'Блок Александр Александрович',
                        userrole: 'Директор'
                    });
                }else{
                    me.interaction.runShowMessage('alert', err.error.text, null, null);
                }
            }
        };

        this.modalService.showLoading(url);

        if(method === 'post'){
            this.http[method](url, data)['subscribe'](successFunc, failureFunc);
        }else{
            this.http[method](url)['subscribe'](successFunc, failureFunc);
        }
    };

    /* СОЗДАНИЕ ССЫЛКИ ЗАПРОСА ПО ПАРАМЕТРАМ */
    private createLink(linkName:string, addRefs:boolean, postfix:string){
        if(!environment) return '';

        let prefix = environment.prefix || '';
        let refs = addRefs ? (environment.refs || '') : '';
        let link = environment[linkName];
        let result = [];
        let lang = (environment && environment.useLangusges && this.currentLanguage) ? this.currentLanguage : '';
        let parameters = this.getLinkParametrs(postfix);

        if(!link) link = linkName;

        if(prefix)          prefix = '/' + prefix;
        if(addRefs && refs) refs = '/' + refs;
        if(link)            link = '/' + link;
        if(lang)            lang = '/' + lang;
        if(postfix && postfix !== 'editor')         postfix = '/' + postfix;
        if(postfix === 'editor') postfix = '';

        ///api/ref/ru/hotel/getmaindata

        if(link) {
            if(link === '/getmenu' || link === '/login'){
                result = [prefix, refs, link, lang, postfix, parameters];
            }else{
                result = [prefix, refs, lang, link, postfix, parameters];
            }

        }

        var css = "color: yellow;";

        //if(result.indexOf('/getmaindata') !== -1) result.push('?sort=shortname|asc&filterobject={"top":"30"}');

        console.log("%c %s", "color: yellow;", JSON.stringify(result));

        return result.join('');
    }

    /* СОБРАТЬ СТРОКУ URL ПОСЛЕ "?" */
    private getLinkParametrs(link){
        let result = [];

        result.push(this.createSortParameter(link));
        result.push(this.createFilterParameter(link));

        return result['clean']().length ? ('?' + result['clean']().join('&')) : '';
    }

    /* СОЗДАТЬ ЧАСТЬ СТРОКИ, ЗАПРАШИВАЮЩУЮ СОРТИРОВКУ */
    private createSortParameter(link){
        let result:string = '';

        if(this.sortName){
            result = 'sort=' + this.sortName + '|' + this.sortDirection;
        }else if(link === 'getmaindata'){
            result = 'sort=shortname|asc'
        }

        return result;
    }

    /* СОЗДАТЬ ЧАСТЬ СТРОКИ, ЗАПРАШИВАЮЩУЮ ФИЛЬТРАЦИЮ */
    private createFilterParameter(link){
        let result:string = '';

        if(this.filterData){
            if(typeof this.filterData === 'string'){
                result = 'filterstring=' + this.filterData;
            }else if(this.filterData instanceof Object){
                result = 'filterobject=' + JSON.stringify(this.filterData)/*.replace(/"/g, '')*/;
            }
        }else if(link === 'getmaindata'){
            result = 'filterobject={"top":"30"}'
        }

        return result;
    }

    /* ЗАПОМНИТЬ ЗНАЧЕНИЕ СОРТИРОВКИ ТАБЛИЦЫ */
    public setSort(callback, {name, direction}){
        if(!name){
            this.sortParameter = '';
            this.sortName = '';
            this.sortDirection = '';
        }else{
            this.sortParameter = name + '=' + (direction || 'asc');
            this.sortName = name;
            this.sortDirection = direction || 'asc';
        }


        if(callback && typeof callback === 'function'){
            callback();
        }
    }

    /* ЗАПОМНИТЬ ЗНАЧЕНИЕ ФИЛЬТРА ТАБЛИЦЫ */
    public setFilterData(data){
        if(data) {
            this.filterData = data;
        }else{
            this.filterData = '';
        }

        this.interaction.runAfterSetFilterData();
    }

    /* ЗАПОМНИТЬ ТЕКУЩИЙ ЯЗЫК */
    private changeCurrentLanguage(lang){
        if(lang && typeof lang === 'string') this.currentLanguage = lang;
    }

}