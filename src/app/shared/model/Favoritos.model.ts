import { environment } from "src/environments/environment";

const base_url = environment.endpointLocalImg;

export class favorito{
  constructor(
  
    public idfavorito?:  number,
    public evento?:  number,
    public usuario?:  number,
    public estado?: number,
    public incluye?:boolean,
  ){}

}
