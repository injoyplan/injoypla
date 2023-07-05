import { CommonModule, NgOptimizedImage, NgIf} from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.modules';
import * as moment from 'moment';
import { UtilsService } from 'src/app/shared/utilitario/util.service';
import { EventoService } from 'src/app/shared/Service/Eventos.service';
import { AuthService } from 'src/app/shared/Service/Usuario.service';
import { RouterLink } from '@angular/router';
import { HeartComponent } from 'src/app/componentes/heart/heart.component';
import { LazyImageComponent } from '../lazy-image/lazy-image.component';

@Component({
  standalone:true,
  imports: [CommonModule,FormsModule,SharedModule,NgOptimizedImage,RouterLink,NgIf,HeartComponent,LazyImageComponent],
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() evento:any;
  @Input() user_data:any;
  @Input() imagenS:any;
  @Input() pantalla:any;
  constructor(private utils: UtilsService,private _EventoService: EventoService,private _clienteService: AuthService){
  }

  compararEntreFechas(DiaEvento:string,value: string,value2: string){
    let enVivo =  false;
    var now = moment().hours();
    var diaActual = Number(moment().format("DD"));
    var diaEvento =   Number(moment(DiaEvento).format("DD"))+1;
    var HoraEventoInicio =  Number(value.split(":")[0]);
    var MinutoEventoInicio =   value.split(":")[1];
    var HoraEventoFin =   Number(value2.split(":")[0]);
    var MinutoEventoFin =   value2.split(":")[1];
    var horaActual =  moment().hours();
    var MinutosActual =  moment().minute();
    if (diaEvento==diaActual) {
      if (HoraEventoInicio <= horaActual &&  HoraEventoFin >= horaActual ) {  //18:00   -- 18:16--  18:50
        enVivo= true;
      }
    }
    return enVivo;
  }
  guardarFavoritos(idEvento: any, idFecha:any){
    var idEvento = idEvento ;
    var idFecha = idFecha;
    if (!this.user_data) {
      this.utils.openSnackBar('Ups! Inicia sesión para agregarlo a tus favoritos', 'warning');

    } else {
      var cliente = {
        evento: idEvento,
        fecha: idFecha,
        usuario: this.user_data.sub
      }
      this._EventoService.registrar_cliente_favorito(cliente).then(
        (response: any) => {
          ////console.log(response);
          this.utils.openSnackBar('¡Hurra, este evento se agregó a tus favoritos!' , 'success');

        },
        error => {
          ////console.log(error);
          if (error.status==403) {
            this.utils.openSnackBar('Ups! Su Sesion se ha terminado', 'error');
            this._clienteService.logout();
           } else {
            this.utils.openSnackBar('Este evento se retiró de tus favoritos', 'error');
           }

        })
      /*var cliente = {
        evento: idEvento,
        fecha: idfecha,
        usuario: this.user_data.sub
      }
      ////console.log(cliente);
     */
    }
  }
}
