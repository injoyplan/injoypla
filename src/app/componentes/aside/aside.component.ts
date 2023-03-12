import { CommonModule, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UtilsService } from 'src/app/shared/utilitario/util.service';
import { EventoService } from 'src/app/shared/Service/Eventos.service';
import { AuthService } from 'src/app/shared/Service/Usuario.service';
import { RestService } from 'src/app/shared/utilitario/rest.service';
import { StorageService } from 'src/app/shared/Service/storage.service';
import { SharedModule } from 'src/app/shared/shared.modules';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterLink } from '@angular/router';
declare var iziToast: any;
declare var jQuery: any;


declare var $: any;
@Component({
  standalone: true,
  imports: [CommonModule,FormsModule,SharedModule,NgOptimizedImage,RouterLink,NgIf],
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent {
  @Input()  idevento:any;
  public ModelfechaEvento: any=[];
  public fecha:any ;
  public _idEvento =0;
  constructor(private utils: UtilsService,private _EventoService: EventoService,private _clienteService: AuthService,private rest: RestService,
    private storageService: StorageService){
      
      this.buscarFechas();
 }
 buscarfecha(id){

 }
 buscarFechas(){
  console.log('***********************buscarFechas')
  console.log(this.idevento)

  this._EventoService.consultar_evento_fecha_favoritos(this.idevento).then(
    (response: any) => {
      console.log('consultar_evento_fecha_favoritos');
      console.log(response);
     
      this.fecha =  response.data._evento[0];
      this.ModelfechaEvento =  response.data._fecha;
      //this.search_Fecha_evento();
    },
    error => {
      if (error.status==403) {
        this.utils.openSnackBar('Ups! Su Sesion se ha terminado', 'error');
        this._clienteService.logout();
       } else {
        this.utils.openSnackBar('Ups!Error de consultar eventos', 'error');
       }

    }
  );
 }
}
