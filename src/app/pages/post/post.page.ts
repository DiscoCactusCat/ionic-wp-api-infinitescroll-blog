import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';

const { Share } = Plugins;
@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  constructor(private api: ApiService, private route: ActivatedRoute) {}

  public post: any;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.getPostContent(id).subscribe((res) => {
      this.post = res;
      console.log('postContent: ', res);
    });
  }

  async sharePost(){
    await Share.share({
      title: this.post.title.rendered,
      text: 'Check this post ; it\' fucking awesome !',
      url: this.post.link,
      dialogTitle: 'Share this'
    });
  }
}
