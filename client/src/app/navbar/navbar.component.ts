import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  profileImagePath: string = '';
  languages = [
    {
      'id': 'en',
      'title': 'English',
      'flag': 'en'
    },
    {
      'id': 'fr',
      'title': 'Français',
      'flag': 'fr'
    }
  ];
  selectedLanguageIndex: number = 1;
  showBack = false;

  get language() {
    return this.languages[this.selectedLanguageIndex];
  }

  get languageIconUrl() {
    return '/assets/images/flags/' + this.language.flag + '.svg';
  }

  constructor(
    private location: Location,
    private router: Router,
    private translate: TranslateService,
    private auth: AuthService
  ) {
    this.showBack = !this.location.isCurrentPathEqualTo('/');
    this.selectedLanguageIndex = this.languages.findIndex((v) => v.id == this.translate.currentLang);

    router.events.subscribe(() => {
      this.showBack = !this.location.isCurrentPathEqualTo('/');
    });
  }

  ngOnInit() {
    this.auth.authentificated.subscribe((result) => {
      if (result) {
        let user = this.auth.getUser();
        this.profileImagePath = user && user.profilePicture;
      } else {
        this.profileImagePath = '';
      }
    });
  }

  back() {
    this.location.back();
  }

  toggleLanguage() {
    this.selectedLanguageIndex++;
    if (this.selectedLanguageIndex >= this.languages.length)
      this.selectedLanguageIndex = 0;
    this.translate.use(this.language.id);
  }

  logout() {
    this.auth.logout();
    location.href = '/login';
  }

}
