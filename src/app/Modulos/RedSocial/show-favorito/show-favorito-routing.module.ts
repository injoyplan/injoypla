import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowFavoritoComponent } from './show-favorito.component';

const routes: Routes = [{ path: '', component: ShowFavoritoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowRoutingModule { }
