import { CommonModule, NgIf, NgOptimizedImage } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GoogleMapsModule } from "@angular/google-maps";
import { RouterLink } from "@angular/router";
import { FooterComponent } from "src/app/componentes/footer/footer.component";
import { HeaderComponent } from "src/app/componentes/header/header.component";
import { SharedModule } from "src/app/shared/shared.modules";
import { ShowFavoritoComponent } from "./show-favorito.component";

import { ShowRoutingModule } from './show-favorito-routing.module';
import { AsideComponent } from "src/app/componentes/aside/aside.component";

@NgModule({
  
  declarations: [
    ShowFavoritoComponent
  ],
  imports: [
    CommonModule,
    HeaderComponent,FooterComponent,FormsModule,SharedModule,RouterLink,GoogleMapsModule,NgOptimizedImage,RouterLink,NgIf,ShowRoutingModule,AsideComponent
  ]
})
export class ShowFavoritoModule {

    constructor(){
      this.ValidaraSiTieneAcceso();
    }
    ValidaraSiTieneAcceso(){

    }
 }
