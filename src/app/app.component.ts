import { ApiService } from './services/api.service';
import { Component } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appPages = [
    {
      title: 'The News',
      url: '/blog',
      icon: 'newspaper',
    },
    {
      title: 'Account',
      url: '/account',
      icon: 'person',
    }
  ];
  constructor(private api: ApiService, private oneSignal: OneSignal, private router: Router) {
    this.setupOneSignalPush();
  }

  ngOnInit() {
    console.log('Init de app component');
    this.api.getPages().subscribe((pages) => {
      this.appPages = [...this.appPages, ...pages];
    });


  }

  setupOneSignalPush() {
    this.oneSignal.startInit(
      '9eee0d66-42eb-4bae-8e68-b893ffeeef70', //ID One signal
      '990943918018' // ID Firebase
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.InAppAlert
    );

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
     this.router.navigateByUrl('/blog');
    });

    this.oneSignal.endInit();
  }
}
