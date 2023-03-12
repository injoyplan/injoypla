import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
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
  public FechaEvento :FechaEvento | undefined;
  public lista_eventos_Destacados: Array<any> = [];
  public desde = 0;
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
    private router: Router, private utils: UtilsService,
    private util: UtilsService,
    private elem: ElementRef,
    private route: ActivatedRoute,private _clienteService: AuthService, private storageService: StorageService) {

    console.log('home');
    this.Listar_eventos_infinito();
  }

  ngOnInit(): void {
    this.user_data= this._clienteService.getCurrentUser();
    this.user_favoritos= this.storageService.getFavorito();
    
    console.log('ngOnInit',this.user_data);
    console.log('ngOnInit',this.user_favoritos);
    this.consultar_total_eventos();
    const gtmTag = {
      event: 'inicio web',
      data: 'my-custom-event',
    };
    console.log(gtmTag);
  //  this.gtmService.pushTag(gtmTag);
  }

  verMas(valor:number,tipo:number) {
    this.isloading = true;
    this.desde += valor;
   
    if(this.desde<0){
      this.desde =0;
      this.Listar_eventos_infinito();
    } else if(tipo>0) {
      this.Listar_eventos_infinito();
      
    }else if(this.desde > this.TotalEventos) {
      this.activoVerMasEventos = false;
      
    }  else if(this.desde == 24){
      //this.activoVerMasEventos = false;
      //this.isloading = false;
      //this.Listar_eventos_infinito();
      this.router.navigate(['/search-eventos/0']);
    } else {
      this.Listar_eventos_infinito();
    }
    console.log(this.activoVerMasEventos);
  }
  consultar_total_eventos() {
    this.isloading = true;
    this.rest.getConsulta(`/consultar_total_eventos`).then((response: any) => {

      response.data.forEach((e:any) => {

        switch (e.eventos_docs[0].Categoria) {
          case '630832a4c6ae463861cdd0a0':
            this.Categoria_musica  +=1;

            break;
          case '630832bac6ae463861cdd0a1':
            this.Categoria_entretenimiento  +=1;

            break;
          case '63083349c6ae463861cdd0a2':

            this.Categoria_Cultura +=1;
            break;
          case '63083352c6ae463861cdd0a3':

            this.Categoria_Teatro +=1;

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
    this.rest.getConsulta(`/listar_Eventos_Publicos_infinito/`+this.desde).then((response: any) => {

        var cantidadTotalEventos =  this.lista_eventos.length;
        if(response.data.some((item :any)=> item.evento.Destacado == 2)) {
          this.lista_eventos_Destacados = response.data.filter((item :any)=> item.evento.Destacado == 2).sort(function(o1:any,o2:any){
            var c = new Date(o1.FechaInicio);
            var d = new Date(o2.FechaInicio);
            return c >=d ? 1 : -1;
          });
        }

        if(response.estado = 1){

          response.data.forEach((e:any) => {
            let incluyeVeinte =false;
            if (this.user_favoritos.length>0) {
              incluyeVeinte = this.user_favoritos.includes(e.eventos_docs[0]._id);
              console.log(e.eventos_docs[0]._id);
              console.log(this.user_favoritos);
            }
          
            this.FechaEvento = new  FechaEvento(e.estado,incluyeVeinte,e.idUsuario,e.HoraFin,e.HoraInicio,e.FechaInicio,e.precioxfechas_docs, e.eventos_docs,e._id);
            this.lista_eventos.push(this.FechaEvento);
          });

          if(this.lista_eventos.length==0 || this.lista_eventos.length<=7){
            this.isloading = true;
            this.verMas(16,1);
            
          } else {
            this.isloading = false;
            cantidadTotalEventos = this.lista_eventos.length;  
            this.TotalEventos = response.TotalEventos;
            if (this.TotalEventos>0) {
              if (cantidadTotalEventos < this.TotalEventos) {
                this.activoVerMasEventos  =  true;
              } else {
                this.activoVerMasEventos  =  false;
              }  
            } else {
              this.activoVerMasEventos =  false;
            }
          }

         
        }

    }).catch((error: any) => {
      this.isloading = false;
      this.util.openSnackBar('Ups! algo ocurrio', 'error');
    });
  }

  EliminarFavoritos(idFavorito: any){

  }
}
