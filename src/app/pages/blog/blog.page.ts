import { CategoryFilterPage } from './../category-filter/category-filter.page';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {

  constructor(
    private api: ApiService,
    private loadingController: LoadingController,
    private popOver: PopoverController,
  ) {}

  public page: number = 1;
  public postsLength: number = 0;
  public pagesLength: number = 0;
  public posts: Array<Object> = [];
    public categoryFilter = null;

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
        this.posts = [...this.posts, ...res.posts];
        infiniteScroll.target.complete();

        if(this.page == this.pagesLength){
          infiniteScroll.target.disabled = true;
        }
      }else{
        this.posts = res.posts;
      }

      this.postsLength = res.postsLength;
      this.pagesLength = res.pages;
      console.log('Resultats de load', res);

    }, err => {
      console.log('loadPosts Error', err);
    }, async ()=>{
      if(!infiniteScroll){
        (await loading).dismiss();
      }
    });
  }

  loadMore(event) {
    this.page++;
    this.loadPosts(event);
  }

  async openFilter(event){
    const popover = await this.popOver.create({
      component: CategoryFilterPage,
      event: event,
      translucent: true,
      componentProps: {
        selected: this.categoryFilter
      }
    });
    popover.onDidDismiss().then(res =>{
      console.log("After popover", res);
      if (res && res.data){
        this.categoryFilter = res.data.id;

      }
    });
    await popover.present();
  }
}
