/**
 * Created by eds on 23.11.2017.
 */
import { Injectable, ViewChild }            from '@angular/core';
import { Subject }                          from 'rxjs/Subject'

@Injectable()
export class ModalInteractionService{
    public runOpenWindowSubject         = new Subject<any>();
    public runEditWindowSubject         = new Subject<any>();
    public runSetValuesSubject          = new Subject<any>();
    public runCloseWindowSubject        = new Subject<any>();
    public runGetValuesSubject          = new Subject<any>();
    public runEditorGetValuesSubject    = new Subject<any>();
    public runFilterGetValuesSubject    = new Subject<any>();
    public runSetWindowPositionSubject  = new Subject<any>();
    public runAfterCloseWindowSubject   = new Subject<any>();
    public runGetClearValuesSubject     = new Subject<any>();
    public runReturnGetValuesSubject    = new Subject<any>();
    public runShowLoadingSubject        = new Subject<any>();
    public runHideLoadingSubject        = new Subject<any>();
    public runUnlockSubject             = new Subject<any>();

    private editor: string = 'editor';
    private filter: string = 'filter';

    public runUnlock() {
        this.runUnlockSubject.next()
    }
    public showLoading(url) {
        this.runShowLoadingSubject.next(url)
    }
    public hideLoading(url) {
        this.runHideLoadingSubject.next(url)
    }

    /* Открыть окно (Filter, Center) => ModalWindow */
    public openWindow(a){
        this.runOpenWindowSubject.next(a)
    }

    public runSetWindowPosition(a){
        this.runSetWindowPositionSubject.next(a)
    }

    public returnGetValues(type, data, values){
        this.runReturnGetValuesSubject.next({type, data, values})
    }

    public getClearValues(a){
        this.runGetClearValuesSubject.next(a)
    }

    public runAfterCloseWindow(a){
        this.runAfterCloseWindowSubject.next(a)
    }

    /* Вставить данные и открыть окно (Center) => ModalWindow */
    public editWindow(a, b){
        this.runEditWindowSubject.next({type: a, data: b})
    }

    /* Вставить данные (Center) => ModalWindow */
    public setValues(a, b){
        this.runSetValuesSubject.next({type: a, data: b})
    }

    /* Закрыть окно Form => ModalWindow */
    public closeWindow(a){
        this.runCloseWindowSubject.next(a)
    }

    public getValues(type, data){
        if(type === this.editor){
            this.runEditorGetValuesSubject.next(data);
        }else if(type === this.filter){
            this.runFilterGetValuesSubject.next(data);
        }

        //this.runGetValuesSubject.next({type: a, data: b})
    }
}