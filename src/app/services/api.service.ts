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

  getPosts(page = 1, categoryId = null, search=''): Observable<any>{
    const options = {
      observe: "response" as "body",
      params: {
        per_page: '2',
        page: ''+page,
      }
    }
    let URL = environment.apiUrl + 'posts?_embed';
    if(categoryId){
      URL+='&categories=' + categoryId ;
    }
    if(search!=''){
      URL += '&search='+search;
    }
    return  this.http.get(URL, options).pipe(
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
            count: item.count,
          })
        }
        return items;
      })
    )
  }



  getPages(){
    return this.http.get<any>(environment.apiUrl + 'pages').pipe(
      map(res=>{

        const matches = [12,10,3,2];
        const items = [];
        for (let item of res){
          if(!matches.includes(item.id)) continue;
          items.push({
            url: 'page/'+item.id,
            title: item.title.rendered,
            icon: 'file-tray',
          })
        }
        return items;
      })
    )
  }

  getPageContent(id){
    return this.http.get<any>(environment.apiUrl + 'pages/' + id + '?_embed').pipe(
      map(post => {
        if(post['_embedded']['wp:featuredmedia']) {
          post.media_url = post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes['full'].source_url;
        }
        return post;
      })
    );
  }

}
