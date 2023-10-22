import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
import { FooterComponent } from 'src/app/componentes/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.modules';
import { CardComponent } from 'src/app/componentes/card/card.component';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { HeartComponent } from 'src/app/componentes/heart/heart.component';
import {SubirEventoMasivoComponent} from "./subir-evento-masivo.component";
import { NavBarComponent } from 'src/app/componentes/nav-bar/nav-bar.component';



const routes :Routes = [
  {
    path:'',
    component: SubirEventoMasivoComponent
  }
]

@NgModule({

  declarations: [ SubirEventoMasivoComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HeaderComponent,FooterComponent,FormsModule,SharedModule,RouterLink,NgOptimizedImage,RouterLink,NavBarComponent
  ]
})
export class SubirEventoMasivoModule {

    constructor(){
      this.ValidaraSiTieneAcceso();
    }
    ValidaraSiTieneAcceso(){

    }
 }
