/**
 * Created by eds on 23.11.2017.
 */
import { Injectable, ViewChild }    from '@angular/core';
import { Subject }                  from 'rxjs/Subject'

@Injectable()

export class InteractionService{
    public runGetFilterSubject              = new Subject<any>();
    public runGetServiceSubject             = new Subject<any>();
    public runGetTabPanelSubject            = new Subject<any>();
    public runGetMainDataSubject            = new Subject<any>();
    public runClearAllSubject               = new Subject<any>();
    public runCreateEditorSubject           = new Subject<any>();
    public runShowMessageSubject            = new Subject<any>();
    public runCtrlASubject                  = new Subject<any>();
    public runServiceMenuSubject            = new Subject<any>();
    public runGridRightClickSubject         = new Subject<any>();
    public runServiceSubject                = new Subject<any>();
    public runChangeCurrentLanguageSubject  = new Subject<any>();
    public runAfterSetFilterDataSubject     = new Subject<any>();
    public runLogoutSubject                 = new Subject<any>();
    public runShowCenterSubject             = new Subject<any>();
    public runShowCentralPanelInfoSubject   = new Subject<any>();

    logout(){
        this.runLogoutSubject.next();
    }
    runShowCentralPanelInfo(){
        this.runShowCentralPanelInfoSubject.next();
    }
    runCtrlA(){
        this.runCtrlASubject.next();
    }

    runService(a){
        this.runServiceSubject.next(a);
    }
    runAfterSetFilterData(){
        this.runAfterSetFilterDataSubject.next();
    }
    runChangeCurrentLanguage(a){
        this.runChangeCurrentLanguageSubject.next(a);
    }
    runServiceMenu(a){
        this.runServiceMenuSubject.next(a);
    }
    runGridRightClick(a){
        this.runGridRightClickSubject.next(a);
    }

    public runShowMessage(type, text, okFunction, closeFunction){
        this.runShowMessageSubject.next({
            type:           type,
            text:           text,
            okFunction:     okFunction,
            closeFunction:  closeFunction
        });
    }

    public runCreateEditor(a){
        this.runCreateEditorSubject.next(a);
    }

    public runMenuClick(item){
        this.runClearAll();

        this.runGetFilter(item.link);
        this.runGetService(item.link);
        this.runGetTabs(item.link);
        this.showCenter();
    }

    private runClearAll(){
        this.runClearAllSubject.next()
    }

    showCenter(){
        this.runShowCenterSubject.next()
    }

    runGetFilter(link: string){
        this.runGetFilterSubject.next(link)
    }

    runGetService(link: string){
        this.runGetServiceSubject.next(link)
    }

    runGetTabs(link: string){
        this.runGetTabPanelSubject.next(link)
    }

    runGetMainData(item: any, link: any){
        this.runGetMainDataSubject.next({item: item, link: link})
    }
}