/**
 * Created by eds on 24.01.2018.
 */
import { Injectable, ErrorHandler, Injector }         from '@angular/core';

import { LocationStrategy, PathLocationStrategy } from '@angular/common';

import * as StackTrace from 'stacktrace-js';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }

    handleError(error) {
        const location = this.injector['get'](LocationStrategy);
        const message = error.message ? error.message : error.toString();
        const url = location instanceof PathLocationStrategy
            ? location.path() : '';

        console.info('message - ',message);
        console.info('url - ',url);
        console.info('location - ',location);
        console.info('error - ',error);

        // get the stack trace, lets grab the last 10 stacks only
        /*StackTrace.fromError(error).then(stackframes => {
            console.info('stackframes - ',stackframes);
            const stackString = stackframes
                .splice(0, 20)
                .map(function(sf) {
                    return sf.toString();
                }).join('\n');
            // log on the server
            console.info('message - ',message);
            console.info('url - ',url);
            console.info('stackString - ',stackString);

            console.log({ message, url, stack: stackString });
        });*/




        throw error;
    }
}