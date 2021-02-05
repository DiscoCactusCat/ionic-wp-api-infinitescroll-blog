import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wp-page',
  templateUrl: './wp-page.page.html',
  styleUrls: ['./wp-page.page.scss'],
})
export class WpPagePage implements OnInit {

  constructor(private api: ApiService, private route: ActivatedRoute) { }
  public page: any;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.getPageContent(id).subscribe((res) => {
      this.page = res;
      console.log('postContent: ', res);
    });
  }

}
