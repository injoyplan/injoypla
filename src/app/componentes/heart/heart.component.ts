import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/shared/utilitario/util.service';
import { EventoService } from 'src/app/shared/Service/Eventos.service';
import { AuthService } from 'src/app/shared/Service/Usuario.service';
import { RestService } from 'src/app/shared/utilitario/rest.service';
import { StorageService } from 'src/app/shared/Service/storage.service';

@Component({
  selector: 'app-heart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heart.component.html',
  styleUrls: ['./heart.component.css']
})
export class HeartComponent {
  @Input()  user_data:any;
  @Input()  id_fecha:any;
  @Input()  id_evento:any;
  @Input()  favoritos:any;
  @Input()  pantalla:any;
  public activado=false;
  public _favoritos:any=[];
  constructor(private utils: UtilsService,private _EventoService: EventoService,private _clienteService: AuthService,private rest: RestService,
     private storageService: StorageService){

  }
  guardarFavoritos(idevento:any,idFecha:any){
    var _idEvento = idevento ;
    if (!this.user_data) {
      this.utils.openSnackBar('Ups! Inicia sesión para agregarlo a tus favoritos', 'warning');
      this.activado= false;
    } else {
      var favoritos = {
        evento: _idEvento,
        idFecha:idFecha,
        token: this.user_data.token
      }

      this._EventoService.registrar_cliente_favorito(favoritos).then(
        (response: any) => {
          ////console.log(response);
          this.utils.openSnackBar('¡Hurra, este evento se agregó a tus favoritos!' , 'success');
          this.favoritos.incluye= true;
          this.verFavoritosUsuario(this.user_data.token);
        },
        error => {
          this.favoritos= false;
          ////console.log(error);
          if (error.status==403) {
            this.utils.openSnackBar('Ups! Su Sesion se ha terminado', 'error');
            this._clienteService.logout();
           } else {
            this.utils.openSnackBar('Ups! No se ha Agregado el evento en tus favoritos', 'error');
           }

        })
      }
  }
  EliminarFavoritos(id_evento:any,id_fecha:any){
    var id_evento= id_evento;
    var id_fecha= id_fecha;
    var idUsuario = this.user_data.sub;
    if (!this.user_data) {
      this.utils.openSnackBar('Ups! Inicia sesión para agregarlo a tus favoritos', 'warning');
    } else {
      this.rest.delete('usuario/eliminar_favoritos/'+id_evento+"/"+id_fecha).then((response: any) => {
        if (response.ok) {
          this.activado= false;
          this.favoritos.incluye= false;
          this.utils.openSnackBar('Este evento se retiró de tus favoritos' , 'success');

          this.verFavoritosUsuario(idUsuario);
        } else {
          this.utils.openSnackBar('Ups! Error al Eliminar en Favoritos', 'error');
        }
      }).catch((err) => {
        this.utils.openSnackBar('Ups! algo ocurrio al eliminar', 'error');
      });
    }
  }
  verFavoritosUsuario(token:any) {

    this._clienteService.consultar_favoritos_guest(
      token
    ).then(logged => {

      var datos = JSON.stringify(logged);
      var informacion = JSON.parse(datos)
      var favoritos: any = [];
      informacion.data.forEach(element => {
        var Modelfavoritos = {
          idEvento :element.ideventos,
          idfecha :element.fecha,
          idFavorito: element.idfavoritos
        }
        favoritos.push(Modelfavoritos);
      });
      this.storageService.saveFavoritos(favoritos);
    }).catch((error) => {
      //console.log(error);
    });
  }


}
