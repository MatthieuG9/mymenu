import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mymenu';
  userIsLogged = false;

  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
    this.auth.authentificated.subscribe((result) => this.userIsLogged = !!result)
  }
}
