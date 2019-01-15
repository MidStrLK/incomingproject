/**
 * Created by eds on 26.12.2017.
 */

// https://ru.wikipedia.org/wiki/ISO_8601

import { Component }    from '@angular/core'

export class DateService {
    //2018-06-29T00:00:00

    public TtoJSConvert(str){
        let result = null;

        try{
            result = new Date(str);
        }catch(error){}

        return result;
    }

    public MStoView(str){
        const jsDate = new Date(str);

        return this.JStoView(jsDate);
    }

    private JStoView(date){
        const year:string  = String(date.getFullYear());
        let   month:string = String(date.getMonth() + 1);
        let   day:string   = String(date.getDate());

        if(month.length < 2) month = '0' + month;
        if(day.length < 2)   day = '0' + day;

        return [day, month, year].join('.');
    }





    /*private correctTimeZone(date){
        const tz = date.getTimezoneOffset();
        const result =

        return result
    }*/

}