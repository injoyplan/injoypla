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
  guardarFavoritos(fechaId:any,Eventi:any){
    console.log('guardarFavoritos')
    console.log(fechaId)
    console.log(Eventi)
    var idEvento = idEvento ;
    var idFecha = idFecha;
    console.log(this.user_data.sub);
    if (!this.user_data) {
      this.utils.openSnackBar('Ups! Inicia sesión para agregarlo a tus favoritos', 'warning');
      this.activado= false;
    } else {
      var cliente = {
        evento: Eventi,
        fecha: fechaId,
        usuario: this.user_data.sub
      }
      this._EventoService.registrar_cliente_favorito(cliente).then(
        (response: any) => {
          //console.log(response);
          this.utils.openSnackBar('Upaa!  Evento agregado a tus favoritos, gracias' , 'success');
          this.favoritos= true;
          this.verFavoritosUsuario(cliente.usuario);
        },
        error => {
          this.favoritos= false;
          //console.log(error);
          if (error.status==403) {
            this.utils.openSnackBar('Ups! Su Sesion se ha terminado', 'error');
            this._clienteService.logout();
           } else {
            this.utils.openSnackBar('Ups! No se ha Agregado el evento en tus favoritos', 'error');
           }

        })
      }
  }
  EliminarFavoritos(fechaId:any,Eventi:any){
    var idFecha = fechaId;
    var idEvento = Eventi;
    var idUsuario = this.user_data.sub;    
    if (!this.user_data) {
      this.utils.openSnackBar('Ups! Inicia sesión para agregarlo a tus favoritos', 'warning');
    } else {
      this.rest.delete('/eliminar_favoritos/'+idFecha+'/'+idEvento+'/'+idUsuario).then((response: any) => {
        if (response.estado == 1) {
          this.activado= false;
          this.favoritos= false;
          this.utils.openSnackBar('muy triste!  Evento se retiro de tus favoritos' , 'success');
          this.verFavoritosUsuario(idUsuario);
        } else {
          this.utils.openSnackBar('Ups! Error al Eliminar en Favoritos', 'error');
        }

      }).catch((err) => {
        this.utils.openSnackBar('Ups! algo ocurrio al eliminar', 'error');
      });
    }
  }
  verFavoritosUsuario(arg0: any) {   

    this._clienteService.consultar_favoritos_guest(
      arg0
    ).then(logged => {
      var datos = JSON.stringify(logged);
      var informacion = JSON.parse(datos)
      var favoritos:any=[];
      informacion.data.forEach(element => {
        favoritos.push(element.evento._id);
      });
      this.storageService.saveFavoritos(favoritos);
    }).catch((error) => {
      console.log(error);
    });
  }
}
