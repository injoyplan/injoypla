import { NgModule } from '@angular/core';
import { CommonModule, NgIf, NgOptimizedImage } from '@angular/common';

import { ShowRoutingModule } from './show-routing.module';
import { ShowComponent } from './show.component';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
import { FooterComponent } from 'src/app/componentes/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.modules';
import { RouterLink } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [
    ShowComponent
  ],
  imports: [
    CommonModule,
    ShowRoutingModule,
    HeaderComponent,FooterComponent,FormsModule,SharedModule,RouterLink,GoogleMapsModule,NgOptimizedImage,RouterLink,NgIf
  ]
})
export class ShowModule {


}
