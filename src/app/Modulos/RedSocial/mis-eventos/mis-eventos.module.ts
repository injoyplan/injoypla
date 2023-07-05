import { CommonModule, NgIf, NgOptimizedImage } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GoogleMapsModule } from "@angular/google-maps";
import { RouterLink, RouterModule, Routes } from "@angular/router";
import { FooterComponent } from "src/app/componentes/footer/footer.component";
import { HeaderComponent } from "src/app/componentes/header/header.component";
import { SharedModule } from "src/app/shared/shared.modules";
import { MisEventosComponent } from "./mis-eventos.component";
import { AsideComponent } from "src/app/componentes/aside/aside.component";
import { NavBarComponent } from "src/app/componentes/nav-bar/nav-bar.component";

const routes :Routes = [
  {
    path:'',
    component: MisEventosComponent
  }
]

@NgModule({

  declarations: [
    MisEventosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HeaderComponent,FooterComponent,FormsModule,SharedModule,RouterLink,GoogleMapsModule,NgOptimizedImage,RouterLink,NgIf,AsideComponent,NavBarComponent
  ]
})
export class MisEventosModule {

    constructor(){
      this.ValidaraSiTieneAcceso();
    }
    ValidaraSiTieneAcceso(){

    }
 }
