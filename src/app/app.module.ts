import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from 'src/app/shared/shared.modules';
import { NarbarComponent } from './Modulos/RedSocial/Eventos/componentes/narbar/narbar.component';







@NgModule({
    declarations: [
        AppComponent,
        NarbarComponent,



    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule, HttpClientModule,    BrowserModule,
        AppRoutingModule, SharedModule
    ]
})
export class AppModule { }
