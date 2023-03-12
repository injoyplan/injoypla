import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/utilitario/util.service';
import { RestService } from 'src/app/shared/utilitario/rest.service';
import { AuthService } from 'src/app/shared/Service/Usuario.service';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  public cliente: any  =  {
    nombre: '',
    Apellido: '',
    email: '',
    telefono: '',    
    genero: '',
  };
  public _fechaStrMinima = "";
  public user_data: any = null;
  public _fechaSrtMaxima = "";
  constructor(private rest: RestService,
    private router: Router, private utils: UtilsService,
    private util: UtilsService,
    private elem: ElementRef,
    private route: ActivatedRoute,private _clienteService: AuthService) {
    console.log('home');    
  }
  ngOnInit(): void {
    this.user_data= this._clienteService.getCurrentUser();
    if (this.user_data) {
      this.ObtenerUsuario();
    }
  }
  ObtenerUsuario() {
    this._clienteService.obtener_cliente_guest(this.user_data.sub).then(
      (response: any) => {
        //console.log('Response+++++++++++++++++++++');
        //console.log(response);
        if (response.estado==1) {
          this.cliente =  response.data[0];
        } else {
          this.utils.openSnackBar('Ups! No hay Datos del', 'error');
        }


      },
      error => {
        this.utils.openSnackBar('Ups! Error en el sistema', 'error');
        console.log(error);
      }
    );
  }
  actualizarPerfil() {
    this._clienteService.actualizar_cliente_guest(this.user_data.sub,this.cliente).then(
      (response: any) => {
        //console.log('Response+++++++++++++++++++++');
        //console.log(response);
        if (response.estado==1) {
          this.cliente =  response.data[0];
          this.utils.openSnackBar('Upa! se actualizo tu información', 'success');
        } else {
          this.utils.openSnackBar('Ups! no se registraron tus datos', 'error');
        }


      },
      error => {
        this.utils.openSnackBar('Ups! Error en el sistemma', 'error');
        //console.log(error);
      }
    );
  }
}
