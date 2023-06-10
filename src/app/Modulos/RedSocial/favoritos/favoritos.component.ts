import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/Service/Usuario.service';
import { UtilsService } from 'src/app/shared/utilitario/util.service';
import {CookieService} from 'ngx-cookie-service';

import { RestService } from './../../../shared/utilitario/rest.service';
import { StorageService } from 'src/app/shared/Service/storage.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent {
  public NombreCliente: any = {};
  public cliente: any  = null;
  public Emailcliente: any = {};
  public user_data: any = null;
  public eventos: any=  0;
  public CantEventFavorito:any =  null;

  constructor(private auth: AuthService,
    private router: Router, private utils: UtilsService,
    private elem: ElementRef,private rest: RestService,
    private route: ActivatedRoute, private cookieService: CookieService,
    private storageService: StorageService
  ){
    
  }
  ngOnInit(): void {
    debugger;
    this.user_data= this.auth.getCurrentUser();
    //console.log(this.user_data);
    if (this.user_data) {   
      this.consultar_favoritos_guest2();
    }
  }
  verFavoritosUsuario(token:any) { 
    //console.log('--verFavoritosUsuario');
    this.auth.consultar_favoritos_guest(
      token
    ).then(logged => {
      //console.log('--verFavoritosUsuario',logged);
      var datos = JSON.stringify(logged);
      var informacion = JSON.parse(datos)
      var favoritos: any = [];
      informacion.data.forEach(element => {
        var Modelfavoritos = {
          idEvento :element.ideventos,
          idfecha :element.FechaInicio,
          idFavorito: element.idfavoritos
        }
        favoritos.push(Modelfavoritos);
      });
      this.consultar_favoritos_guest2();
      this.storageService.saveFavoritos(favoritos);
    }).catch((error) => {
      //console.log(error);
    });
  }
  consultar_favoritos_guest2(){
    this.rest.get('usuario/consultarfavoritos/'+this.user_data.token).then((response: any) => {
      //console.log(response);
      this.eventos =  response.data;
      this.CantEventFavorito  =  response.data.length;
    }).catch((error: any) => {

    });
  }
  EliminarFavoritos(id_evento:any,id_fecha:any){
    ////console.log('idFavorito');
    ////console.log(Idfavorito);
    if (!this.user_data) {
      this.utils.openSnackBar('Ups! Inicia sesión para agregarlo a tus favoritos', 'warning');
    } else {
      this.rest.delete('usuario/eliminar_favoritos/'+id_evento+"/"+id_fecha).then((response: any) => {
        if (response.ok) {
          this.verFavoritosUsuario(this.user_data.token);
          this.utils.openSnackBar('ohhh!  Evento eliminado de tus favoritos, gracias' , 'success');
        } else {
          this.utils.openSnackBar('Ups! Error al Eliminar en Favoritos', 'error');
        }

      }).catch((err) => {
        if (err.status==403) {
          this.auth.logout();
          this.utils.openSnackBar('Ups! Su usuario se acabo', 'error');
         } else {
          this.utils.openSnackBar('Ups! algo ocurrio al eliminar', 'error');
         }

      });
    }
  }
  irPantallafavoritoShow(idEvento){
    this.rest.getConsulta('validarSiTieneFechasActivas/'+idEvento).then((response: any) => {
      if(response.data==0){
        this.utils.openSnackBar('Ups!El evento ya caduco', 'warning');
      } else {
        this.utils.openSnackBar('Ups!Todavia hay eventos', 'success');
        this.router.navigate(['/show-favoritos/'+idEvento]);
      }     
    }).catch((error: any) => {
      return [];
    });
  
    /*if(datos.length>0){
      this.router.navigate(['/show-favoritos/'+idEvento]);
      //console.log(idEvento)
    } else {
      this.utils.openSnackBar('Ups!Error de consultar eventos', 'error');
    }*/
 
  }
  validarSiTieneFechasActivas(idEvento: any) {
    
  }
 

}
