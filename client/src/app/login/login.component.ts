import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(protected authService:AuthService) { }

  ngOnInit() {
  }

  login(providerName:string)
  {
    this.authService.login(providerName);
  }

}
