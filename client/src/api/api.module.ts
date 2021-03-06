import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from 'src/auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';



@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AuthModule
  ]
})
export class ApiModule { }
