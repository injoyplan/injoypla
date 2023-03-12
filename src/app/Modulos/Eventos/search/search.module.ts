import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SearchComponent } from './search.component';
import {  RouterLink, RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
import { FooterComponent } from 'src/app/componentes/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.modules';
import { CardComponent } from 'src/app/componentes/card/card.component';
import { HeartComponent } from 'src/app/componentes/heart/heart.component';

const routes :Routes = [
  {
    path:'',
    component: SearchComponent
  }
]

@NgModule({
  declarations: [SearchComponent],
  providers: [
    DatePipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HeaderComponent,FooterComponent,FormsModule,SharedModule,CardComponent,RouterLink,HeartComponent
  ]
})
export class SearchModule {
 }
