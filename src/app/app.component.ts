import { ApiService } from './services/api.service';
import { Component } from '@angular/core';

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
      icon: 'newspaper'
    }
  ];
  constructor(private api: ApiService) {}

  ngOnInit(){
    console.log("Init de app component");
    this.api.getPages().subscribe(pages => {
      this.appPages = [...this.appPages, ...pages];
    });
  }
}
