import { Injectable, ViewChild }            from '@angular/core';
import { RequestService }            from './request.service';

@Injectable()
export class StatusService {
    userStatus: any = {
        username: 'Михаил Юрьевич Лермонтов',
        userrole: 'Менеджер'
    };

    constructor(private  request:RequestService){

    }

    getStatus(callback){
        if(this.userStatus){
            callback(this.userStatus);
        }else{
            return this.request.getStatus(data => {
                this.userStatus = data;
                callback(data);
            });
        }
    }
}
