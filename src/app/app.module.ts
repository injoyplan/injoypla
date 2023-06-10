import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from 'src/app/shared/shared.modules';



@NgModule({
    declarations: [
        AppComponent,

    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule, HttpClientModule,    BrowserModule,
        AppRoutingModule, SharedModule
    ]
})
export class AppModule { }
