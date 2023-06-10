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
    //console.log('home');    
  }
  ngOnInit(): void {
    this.user_data= this._clienteService.getCurrentUser();
    //console.log(this.user_data);
    if (this.user_data) {
      this.ObtenerUsuario();
    }
  }
  ObtenerUsuario() {
    //console.log(this.user_data.token);
    this._clienteService.obtener_cliente_guest(this.user_data.token).then(
      (response: any) => {
        if (response.ok) {
          this.cliente =  response.data;
        } else {
          this.utils.openSnackBar('Ups! No hay Datos del', 'error');
        }
      },
      error => {
        if (error.message=="Invalid Token...") {
          this.router.navigate(['/']);
        } else {
          this.utils.openSnackBar(error.message, 'error');
        }
       
       
      }
    );
  }
  actualizarPerfil() {
    this._clienteService.actualizar_cliente_guest(this.cliente).then(
      (response: any) => {
        ////console.log('Response+++++++++++++++++++++');
        ////console.log(response);
        if (response.ok) {
          this.cliente =  response.data;
          this.utils.openSnackBar('Upa! se actualizo tu información', 'success');
        } else {
          this.utils.openSnackBar('Ups! no se registraron tus datos', 'error');
        }


      },
      error => {
        this.utils.openSnackBar('Ups! Error en el sistemma', 'error');
        ////console.log(error);
      }
    );
  }
}
