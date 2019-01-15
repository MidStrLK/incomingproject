/**
 * Created by eds on 23.11.2017.
 */
import { Injectable, ViewChild }            from '@angular/core';
import { Subject }                          from 'rxjs/Subject'

@Injectable()
export class ClearInteractionService{
    public runOpenWindowSubject         = new Subject<any>();

    public openWindow(a){
        this.runOpenWindowSubject.next(a)
    }

}