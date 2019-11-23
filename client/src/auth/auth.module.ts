import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class AuthModule { }
