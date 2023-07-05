import { CommonModule, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EventoService } from 'src/app/shared/Service/Eventos.service';
import { AuthService } from 'src/app/shared/Service/Usuario.service';
import { StorageService } from 'src/app/shared/Service/storage.service';
import { RestService } from 'src/app/shared/utilitario/rest.service';
import { UtilsService } from 'src/app/shared/utilitario/util.service';
@Component({
  selector: 'app-mis-eventos',
  templateUrl: './mis-eventos.component.html',
  styleUrls: ['./mis-eventos.component.css'],

})
export class MisEventosComponent implements OnInit {
  public eventos: any=  0;
  public user_data: any = null;
  public filter_busqueda='';
  public page = 0;
  public pageSize = 12;
  public CantEventmios:any =  null;
  public activoVerMasEventos= true;
  public load_data_add= false;
  public eventos_clone_scroll: Array<any>=[]
  constructor(private auth: AuthService,
    private router: Router, private utils: UtilsService,
    private elem: ElementRef,private rest: RestService,
    private route: ActivatedRoute, private cookieService: CookieService,
    private storageService: StorageService,private _clienteService: AuthService,private _EventoService: EventoService
  ){

  }

  ngOnInit(): void {
    debugger;
    this.user_data= this.auth.getCurrentUser();
    //console.log(this.user_data);
    if (this.user_data) {
      this.consultar_mis_eventos(1);
    } else {
      this.router.navigate(['/']);
    }
  }

  activarDesactivar(_idEventos:number,_estado:number){

    var eventoAcambiar = {
      evento: _idEventos,
      estado: (_estado==1)?0:1
    }

    this._EventoService.activarDesactivarEventos(eventoAcambiar).then(
      (response: any) => {
        ////console.log(response);
        this.utils.openSnackBar('¡Hurra, este evento se desactivo!' , 'success');
        if (this.page<=12) {
          this.page=0;
        }

        this.consultar_mis_eventos(0,true,false,false);

      },
      error => {

        ////console.log(error);
        if (error.status==403) {
          this.utils.openSnackBar('Ups! Su Sesion se ha terminado', 'error');
          this._clienteService.logout();
         } else {
          this.utils.openSnackBar('Ups! No se ha podido desactivar', 'error');
         }

      })
  }

  getClass(estado: number) {
    return {
      'border-danger': estado == 2,
      'border-success': estado == 1
    }
  }

  onScroll(){
    console.log(this.page);
    this.eventos_clone_scroll= this.eventos;
    this.consultar_mis_eventos(this.page,false,true);
  }
  buscar_mis_eventos(){
    this.page = 0;
    this.consultar_mis_eventos(0);
  }
  consultar_mis_eventos(Page:number,vieneFiltro:boolean=true,CargarLoad_Data:boolean=false,load_data_add:boolean=true) {
    debugger;
    this.load_data_add = load_data_add;
    var filter_productos = {
      busqueda:this.filter_busqueda==""?"0":this.filter_busqueda,
      cantPage:this.pageSize,
      nroPagina:this.page
    }
    console.log(filter_productos);
    this._clienteService.listar_mis__eventos(filter_productos).then(
      (response: any) => {
        debugger;
        this.CantEventmios  =  response.data[1][0].TotalMiseventos;

        if (this.eventos_clone_scroll.length>0) {
          const all = [...this.eventos_clone_scroll, ...response.data[0]];
          this.eventos_clone_scroll = all;
          this.eventos = this.eventos_clone_scroll;
          if(this.eventos_clone_scroll.length == this.CantEventmios){
            this.activoVerMasEventos = false;
          }
          this.page =this.eventos.length;
        } else {
          this.eventos =  response.data[0];
          this.page = response.data[0].length;
          if(this.eventos.length == this.CantEventmios){
            this.activoVerMasEventos = false;
          }
        }

        this.load_data_add = false;

      },
      error => {

        this.utils.openSnackBar('Ups! Error en el filtro', error);
        window.location.reload();
        localStorage.clear();
        this.router.navigate(['/']);
      }
    );
  }

}
