import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SearchComponent } from './Modulos/Eventos/search/search.component';
import { InicioComponent } from "./Modulos/inicio/inicio.component";
import { AcercaNosotrosComponent } from "./Modulos/Pagina/acerca-nosotros/acerca-nosotros.component";
import { TerminosCondicionesComponent } from "./Modulos/Pagina/terminos-condiciones/terminos-condiciones.component";
import { PreguntaFrecuenteComponent } from "./Modulos/Pagina/pregunta-frecuente/pregunta-frecuente.component";
import { PoliticaPrivacidadComponent } from "./Modulos/Pagina/politica-privacidad/politica-privacidad.component";

const routes: Routes = [
  { path: '', component: InicioComponent},
  { path: 'search-eventos/:slug', loadChildren:()=> import('../app/Modulos/Eventos/search/search.module').then(m=>m.SearchModule)},
  { path: 'show/:fecha/:evento', loadChildren: () => import('./Modulos/Eventos/show/show.module').then(m => m.ShowModule) },
  { path: 'show-favoritos/:idEvento',canActivate:[AuthGuard], loadChildren: () => import('./Modulos/RedSocial/show-favorito/show-favorito.module').then(m => m.ShowFavoritoModule) },
  { path: 'cuenta/perfil' ,canActivate:[AuthGuard], loadChildren: () => import('./Modulos/RedSocial/usuario/usuario.module').then(m => m.UsuarioModule) },
  { path: 'cuenta/favoritos',canActivate:[AuthGuard], loadChildren: () => import('./Modulos/RedSocial/favoritos/Favoritos.module').then(m => m.FavoritosModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '****', redirectTo: 'home', pathMatch: 'full' },
  { path: 'Acerca-nosostros', component: AcercaNosotrosComponent},
  { path: 'Terminos-Condiciones', component: TerminosCondicionesComponent},
  { path: 'Preguntas-Frecuentes', component: PreguntaFrecuenteComponent},
  { path: 'Politica-Privacidad', component: PoliticaPrivacidadComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
