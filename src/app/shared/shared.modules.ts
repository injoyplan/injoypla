import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormatDateDiaPipe } from './pipe/format-date-dia.pipe';
import {formatdaterestadiapipe} from './pipe/format-date-resta-dia.pipe';
import {FormatDateTimePipe} from './pipe/format-date-Time.pipe';
import {FormatMoneyPipe} from './pipe/format-money.pipe';
import {FormatDateTimeShorPipe} from './pipe/FormatDateTimeShor.pipe';
import { FormatDateMesPipe } from "./pipe/Format-date-Mes.Pipe";
//import {FormatDateBetweenFechaPipe} from './pipe/format-date-between-fecha.pipe';
@NgModule({
  declarations: [
    FormatDateDiaPipe,
    formatdaterestadiapipe,
    FormatDateMesPipe,
    FormatDateTimeShorPipe,FormatMoneyPipe,FormatDateTimePipe//,FormatDateBetweenFechaPipe
  ],
  imports: [
    CommonModule,
    RouterModule,FormsModule
  ],
  exports: [
    FormsModule,
    FormatDateDiaPipe,
    FormatDateMesPipe,
    formatdaterestadiapipe,
    FormatDateTimeShorPipe,FormatMoneyPipe,FormatDateTimePipe//,FormatDateBetweenFechaPipe
  ],
})
export class SharedModule { }
