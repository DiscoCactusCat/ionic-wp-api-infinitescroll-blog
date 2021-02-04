import { Injectable} from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getPosts(page = 1): Observable<any>{
    const options = {
      observe: "response" as "body",
      params: {
        per_page: '2',
        page: ''+page,
      }
    }
    return  this.http.get(environment.apiUrl + 'posts?_embed', options).pipe(
      map( (res) => {
        const data = res['body'];
        for(let post of data){
          if(post['_embedded']['wp:featuredmedia']) {
            post.media_url = post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes['medium'].source_url;
          }
        }

        return {
          posts: data,
          pages: res['headers'].get('x-wp-totalpages'),
          postsLength:  res['headers'].get('x-wp-total'),
        }
      })
    )
  }

  getPostContent(id){
    return this.http.get<any>(environment.apiUrl + 'posts/' + id + '?_embed').pipe(
      map(post => {
        if(post['_embedded']['wp:featuredmedia']) {
          post.media_url = post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes['full'].source_url;
        }
        return post;
      })
    );
  }

  getCategories(){
    return this.http.get<any>(environment.apiUrl + 'categories').pipe(
      map(res=>{
        console.log("Get categories", res);
        const items = [];
        for (let item of res){
          items.push({
            id: item.id,
            name: item.name,
            slug: item.slug,
          })
        }
        return items;
      })
    )
  }
}
