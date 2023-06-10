import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, ElementRef, NgZone } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FooterComponent } from 'src/app/componentes/footer/footer.component';
import { HeaderComponent } from 'src/app/componentes/header/header.component';

import localePy from '@angular/common/locales/es';
import { ActivatedRoute, Router } from '@angular/router';
//import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { FechaEvento } from 'src/app/shared/model/FechaEvento.model';
import { RestService } from 'src/app/shared/utilitario/rest.service';
import { UtilsService } from 'src/app/shared/utilitario/util.service';
import { EventoService } from 'src/app/shared/Service/Eventos.service';
import { AuthService } from 'src/app/shared/Service/Usuario.service';
import { FormsModule } from '@angular/forms';

import * as moment from 'moment';
import { CardComponent } from 'src/app/componentes/card/card.component';
registerLocaleData(localePy, 'es');
import { RouterLink } from '@angular/router';
import { StorageService } from 'src/app/shared/Service/storage.service';
import { favorito } from 'src/app/shared/model/Favoritos.model';
import { BrowserModule, Meta } from '@angular/platform-browser';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;
@Component({
  standalone:true,
  selector: 'app-inicio',
  imports: [HeaderComponent,FooterComponent,NgxSkeletonLoaderModule,FormsModule,CommonModule,CardComponent,RouterLink],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  
  public lista_eventos: Array<any> = [];
  public lista_eventosv2: Array<any> = [];
  public FechaEvento :FechaEvento | undefined;
  public lista_eventos_Destacados: Array<any> = [];
  public desde = 0;
  public EventosXPagina = 12;
  public nroPagina = 0;
  public isloading = false;
  public Categoria_musica = 0;
  public Categoria_entretenimiento = 0;
  public Categoria_Teatro = 0;
  public Categoria_Cultura = 0;
  public TotalEventos = 0;
  public activoVerMasEventos = false;
  public user_data: any = null;
  public user_favoritos: any = null;
  constructor(private rest: RestService,
    private router: Router, private utils: UtilsService,private metaService:Meta,
    private util: UtilsService,
    private elem: ElementRef,private _eventoService: EventoService, private  ngZone:NgZone,
    private route: ActivatedRoute,private _clienteService: AuthService, private storageService: StorageService,
    ) {

    //console.log('home');
    this.Listar_eventos_infinito();
  }

  ngOnInit(): void {
    this.user_data= this._clienteService.getCurrentUser();
    this.user_favoritos= this.storageService.getFavorito();
  
    this.consultar_total_eventos();
    const gtmTag = {
      event: 'inicio web',
      data: 'my-custom-event',
    };
    //console.log(gtmTag);
  //  this.gtmService.pushTag(gtmTag);
  }

  verMas(valor:number,tipo:number) {
    this.isloading = true;
    this.nroPagina = this.nroPagina;
    debugger;
    if(this.nroPagina== 36){
      this.router.navigate(['/search-eventos/0']);
    }else
    if(this.nroPagina>=0 && this.nroPagina<23){
      this.Listar_eventos_infinito();
    }  
  }
  consultar_total_eventos() {
    this.isloading = true;
    this.rest.getConsulta(`eventos/getCantEventXCategoria`).then((response: any) => {
      //console.log(response);
      response.data.forEach((e:any) => {

        switch (e.categoria_id) {
          case 1:
            this.Categoria_musica = e.cantidad;

            break;
          case 2:
            this.Categoria_entretenimiento = e.cantidad;

            break;
          case 3:

            this.Categoria_Cultura = e.cantidad;
            break;
          case 4:

            this.Categoria_Teatro = e.cantidad;

            break;
        }
      });
      this.isloading = false;
    }).catch((error: any) => {
      this.isloading = false;
      this.util.openSnackBar('Ups! algo ocurrio', 'error');
    });

  }


  Listar_eventos_infinito() {
   
    this.rest.getConsulta(`eventos/listarEventosxPaginate/`+this.EventosXPagina+`/`+this.nroPagina).then((response: any) => {
        //console.log(response);
        var cantidadTotalEventos =  response.data.length;
        console.log('Listar_eventos_infinito',response.data);
        if(response.estado = 1){
      
          response.data.forEach((e:any) => {
            console.log('Listar_eventos_infinito',e);
            var incluyeVeinte:favorito = new favorito();
            if (this.user_favoritos.length>0) {
              console.log('Listar_eventos_infinito',e);
              incluyeVeinte =  this.user_favoritos.find(t=>t.idEvento == e.ideventos && t.idfecha == e.idfecha);
              if ((incluyeVeinte!=undefined)) {
                incluyeVeinte.incluye=(incluyeVeinte!=undefined) ? true: false;
              } else {
                incluyeVeinte= new favorito();
                incluyeVeinte.incluye=false;
              }
            } else {
              incluyeVeinte.incluye=false;
            }
            this.FechaEvento = new  FechaEvento(e.estado,incluyeVeinte,e.idUsuario,e.HoraFinal,e.HoraInicio,
                                                e.FechaInicio,e.Monto,e.NombreLocal,e.url, e.urlFuente,e.titulo,e.ideventos,e.idfecha
                                                );
          
            this.lista_eventos.push(this.FechaEvento);
          });
          this.isloading = false;
          cantidadTotalEventos = this.lista_eventos.length;  
          this.TotalEventos = response.TotalEventos;
          if (cantidadTotalEventos <= 24) {
            this.activoVerMasEventos  =  true;
          } else {
            this.activoVerMasEventos  =  false;
          }  
          this.nroPagina += cantidadTotalEventos;
        }

    }).catch((error: any) => {
      //console.log(error);
      this.isloading = false;
      this.util.openSnackBar('Ups! algo ocurrio', 'error');
    });
  }

  EliminarFavoritos(idFavorito: any){

  }
  actualizarEvento(idFavorito: boolean){
    //console.log('actualizarEvento---------------------->',idFavorito);
    if(idFavorito){
      this.EventosXPagina = 12;
      this.nroPagina = 0;
      
      this.lista_eventosv2 = this.lista_eventos;
      //console.log(this.lista_eventosv2);
      this.Listar_eventos_infinitov_copy();
     
    }
  }
  Listar_eventos_infinitov_copy() {
    debugger;
    this.user_favoritos= this.storageService.getFavorito();
      console.log('Listar_eventos_infinitov_copy',this.lista_eventosv2)
      this.lista_eventos = [];
      var cantidadTotalEventos =  this.lista_eventosv2.length;
      if(cantidadTotalEventos > 1){
    
        this.lista_eventosv2.forEach((e:any) => {
         
          var incluyeVeinte:favorito = new favorito();
          debugger;
          if (this.user_favoritos.length>0) {
            incluyeVeinte =  this.user_favoritos.find(t=>t.idEvento == e.evento && t.idfecha == e.idfecha);
            console.log(incluyeVeinte);
            if ((incluyeVeinte!=undefined)) {
              incluyeVeinte.incluye=(incluyeVeinte!=undefined) ? true: false;
            } else {
              incluyeVeinte= new favorito();
              incluyeVeinte.incluye=false;
            }
          } else {
            incluyeVeinte.incluye=false;
          }
          this.FechaEvento = new  FechaEvento(e.estado,incluyeVeinte,e.idUsuario,e.HoraFinal,e.HoraInicio,
                                              e.FechaInicio,e.Monto,e.NombreLocal,e.url, e.urlFuente,e.titulo,e.evento,e.idfecha
                                              );

          this.lista_eventos.push(this.FechaEvento);
        });
        this.isloading = false;
        cantidadTotalEventos = this.lista_eventos.length;  
        this.TotalEventos = cantidadTotalEventos;
        if (cantidadTotalEventos <= 24) {
          this.activoVerMasEventos  =  true;
        } else {
          this.activoVerMasEventos  =  false;
        }  
        this.nroPagina += cantidadTotalEventos;
      }
  }
}
