import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {
  public page: number = 1;
  public postsLength: number = 0;
  public pagesLength: number = 0;
  public posts: Array<Object> = [];
  constructor(
    private api: ApiService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts(infiniteScroll = null) {
    let loading = null;
    if (!infiniteScroll) {
      loading = this.loadingController.create({
        message: 'Loading posts ...',
      });
      (await loading).present();
    }

    this.api.getPosts(this.page).subscribe(async (res) => {
      this.postsLength = res.postsLength;

      if (infiniteScroll) {
        infiniteScroll.target.complete();
        this.posts = [...this.posts, ...res.posts];

        if(this.page == this.pagesLength){
          infiniteScroll.target.disabled = true;
        }
      }else{
        this.posts = res.posts;
      }

      this.postsLength = res.postsLength;
      this.pagesLength = res.pages;
      console.log('Resultats de load', res);
      if(!infiniteScroll){
        (await loading).dismiss();
      }
    });
  }

  loadMore(event) {
    this.page++;
    this.loadPosts(event);
  }
}
