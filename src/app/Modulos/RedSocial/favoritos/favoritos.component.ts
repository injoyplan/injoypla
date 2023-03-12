import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/Service/Usuario.service';
import { UtilsService } from 'src/app/shared/utilitario/util.service';
import {CookieService} from 'ngx-cookie-service';

import { RestService } from './../../../shared/utilitario/rest.service';

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
  public eventos: any=  null;
  public CantEventFavorito:any =  null;

  constructor(private auth: AuthService,
    private router: Router, private utils: UtilsService,
    private elem: ElementRef,private rest: RestService,
    private route: ActivatedRoute, private cookieService: CookieService
  ){
    
  }
  ngOnInit(): void {
    debugger;
    this.user_data= this.auth.getCurrentUser();
    if (this.user_data) {   
      this.consultar_favoritos_guest();
    }
  }
  consultar_favoritos_guest(){
    this.rest.get('/listar_favoritos/'+this.user_data.sub).then((response: any) => {
      console.log(response);
      this.eventos =  response.data;
      this.CantEventFavorito  =  response.data.length;
    }).catch((error: any) => {

    });
  }
  EliminarFavoritos(id){

  }
  irPantallafavoritoShow(idEvento){
    console.log(idEvento);
    this.rest.getConsulta('validarSiTieneFechasActivas/'+idEvento).then((response: any) => {
      console.log(response.data);
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
      console.log(idEvento)
    } else {
      this.utils.openSnackBar('Ups!Error de consultar eventos', 'error');
    }*/
 
  }
  validarSiTieneFechasActivas(idEvento: any) {
    
  }
 

}
