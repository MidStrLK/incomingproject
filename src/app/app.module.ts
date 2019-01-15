import { BrowserModule }                            from '@angular/platform-browser';
import { NgModule, ErrorHandler }  from '@angular/core';
import { NgClass }                                  from '@angular/common';
import { HttpClientModule, HttpClient,HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import { BrowserAnimationsModule }                  from "@angular/platform-browser/animations";
import { LocationStrategy, HashLocationStrategy }   from "@angular/common";
import { Validators,NG_VALIDATORS, NG_ASYNC_VALIDATORS }       from "@angular/forms";
import { CdkTableModule }                           from '@angular/cdk/table';

import { CustomFormsModule }                        from 'ng5-validation'

import { AppComponent }                             from './app.component';
import { ModalWindow }                              from './modal/modal.component';
import { MessageWindow }                            from './message/message.component';
import { LoadMsg }                                  from './load/loadmsg.component';
import { MenuPlaceComponent }                       from './places/menu/menu.component';
import { CenterPlaceComponent }                     from './places/center/center.component';
import { GridPlaceComponent }                       from './places/grid/grid.component';
import { ServicePlaceComponent }                    from './places/service/service.component';
import { SummaryPlaceComponent }                    from './places/summary/summary.component';
import { TabPlaceComponent }                        from './places/tab/tab.component';
import { InfoPlaceComponent }                       from './places/info/info.component';
import { FilterPlaceComponent }                     from './places/filter/filter.component';
import { FilterInputPlaceComponent }                from './places/filterinput/filter_input.component';
import { LanguagebuttonPlaceComponent }             from './places/languagebutton/languagebutton.component';
import { AuthPlaceComponent }                       from './places/auth/auth.component';
import { UserButtonPlaceComponent }                 from './places/userbutton/userbutton.component';

import { InteractionService }                       from './interaction/interaction.service';
import { ModalInteractionService }                  from './interaction/modal.service';
import { ClearInteractionService }                  from './interaction/clear.service';
import { RequestService }                           from './shared/request.service';
import { ElementsService }                          from './shared/elements.service';
import { GlobalErrorHandler }                       from './shared/error.service';
import { AuthService }                              from './shared/auth.service';
import { StatusService }                            from './shared/status.service';
import { DateService }                              from './shared/date.service';
import { TokenInterceptor }                         from './shared/token.interseptor';

import { DynamicFormComponent }                     from './dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent }             from './dynamic-form/dynamic-form-question.component';

import { AngularFontAwesomeModule } from 'angular-font-awesome';


//import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
//import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    MAT_DATE_LOCALE
} from '@angular/material';



@NgModule({
    exports: [
        CdkTableModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule
    ]
})

export class DemoMaterialModule {}

@NgModule({
    exports: [
        CdkTableModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule
    ],
    declarations: [
        AppComponent,
        MenuPlaceComponent,
        FilterPlaceComponent,
        CenterPlaceComponent,
        GridPlaceComponent,
        ServicePlaceComponent,
        SummaryPlaceComponent,
        TabPlaceComponent,
        InfoPlaceComponent,
        FilterInputPlaceComponent,
        LanguagebuttonPlaceComponent,
        AuthPlaceComponent,
        UserButtonPlaceComponent,
        //FilterButtonComponent,

        DynamicFormComponent,
        DynamicFormQuestionComponent,

        ModalWindow,
        MessageWindow,
        LoadMsg

        /*ComboboxComponent,
        TextfieldComponent,
        FieldsetComponent,


        MaterialSampleFormComponent,

        ModalComponent*/
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFontAwesomeModule,
        /*TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: function (http:HttpClient) {
                    return new TranslateHttpLoader(http);
                },
                deps: [HttpClient]
            }
        }),*/

        MatCardModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        DemoMaterialModule,

        CustomFormsModule
    ],
    providers: [
        InteractionService,
        ModalInteractionService,
        ClearInteractionService,
        RequestService,
        ElementsService,
        AuthService,
        StatusService,
        DateService,
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'ru'
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        /*{
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        },*/
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
