import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './../shared/Service/Usuario.service';
import { StorageService } from './../shared/Service/storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  public searchOpen = false;
  public user_data: any = null;
  constructor(private _AuthService:AuthService,private _router:Router,private storageService:StorageService){

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    
    const dateExpire = this.storageService.getUser();   
    var exp = dateExpire.exp_time * 1000;
    var fechaExpiracion =  new Date(exp);
    var fechaActual =  new Date();
    if(fechaActual.toLocaleString() == fechaExpiracion.toLocaleString()){
      this.storageService.clean();
    }
    /*//console.log('canActivate')                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    this.user_data= this._AuthService.getCurrentUser();
    //console.log('canActivate',this.user_data)
    if (this.user_data) {
      //console.log('existe data')
      if (!this._AuthService.validarToken()) {
        //console.log('-----------t-------------')
        this._router.navigate(['/login']);

      } else {
        //console.log('no token valido');
        this._AuthService.logout();
      }


    } else {
      //console.log('-----------q-------------')
      this._AuthService.logout();

    }

  }
*/
  }

}
