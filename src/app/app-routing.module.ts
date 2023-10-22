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
  { path: 'cuenta/mis-eventos',canActivate:[AuthGuard], loadChildren: () => import('./Modulos/RedSocial/mis-eventos/mis-eventos.module').then(m => m.MisEventosModule) },
  { path: 'cuenta/subir-eventos-masivo',canActivate:[AuthGuard], loadChildren: () => import('./Modulos/RedSocial/subir-evento-masivo/subir-evento-masivo.module').then(m => m.SubirEventoMasivoModule) },
  { path: 'cuenta/Eventos/editar-eventos/:idEvento',canActivate:[AuthGuard], loadChildren: () => import('./Modulos/RedSocial/Eventos/editar-evento/editar.module').then(m => m.EditarEventoModule) },
  { path: 'cuenta/Eventos/nuevo-eventos',canActivate:[AuthGuard], loadChildren: () => import('./Modulos/RedSocial/Eventos/nuevo-evento/nuevo.module').then(m => m.NuevoEventoModule) },
  
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
