import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { EditarEventoComponent } from './editar-evento.component';
const routes :Routes = [
  {
    path:'',
    component: EditarEventoComponent
  }
]


@NgModule({
  declarations: [EditarEventoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class EditarEventoModule { }
