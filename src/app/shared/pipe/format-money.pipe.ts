import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMoney'
})
export class FormatMoneyPipe implements PipeTransform {


  transform(value: string): string {

    if (value == null) {
      return "S/ " + parseFloat("0.0").toFixed(2);
    } else {
      return "S/ " + parseFloat(value).toFixed(2);
    }
    //return  Dia.toString(); //Dia.toLocaleDateString("es-ES",{ day: "numeric" });

    //return null;
  }

}
