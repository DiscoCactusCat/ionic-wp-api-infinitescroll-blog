import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

const JWT_KEY = 'jwt_token';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private platform: Platform
  ) {
    this.platform.ready().then(()=>{
      this.storage.get(JWT_KEY).then(data =>{
        if(data){
          console.log('JWT_KEY', data);
          this.user.next(data);
        }
      })
    })
  }

  private user = new BehaviorSubject(null);

  signIn(username, password){
    return this.http.post(environment.apiAuthUrl+'token',{username, password}).pipe(
      switchMap(data => {
        console.log('Signin en cours');
        return from(this.storage.set(JWT_KEY,data));
      }),
      tap( data => {
        this.user.next(data);
      })
    )
  }

  getCurrentUser(){
    return this.user.asObservable();
  }

  logout(){
    this.storage.remove(JWT_KEY).then(()=>{
      this.user.next(null);
    })
  }
  getPosts(page = 1, categoryId = null, search = ''): Observable<any> {
    const options = {
      observe: 'response' as 'body',
      params: {
        per_page: '2',
        page: '' + page,
      },
    };
    let URL = environment.apiUrl + 'posts?_embed';
    if (categoryId) {
      URL += '&categories=' + categoryId;
    }
    if (search != '') {
      URL += '&search=' + search;
    }
    return this.http.get(URL, options).pipe(
      map((res) => {
        const data = res['body'];
        for (let post of data) {
          if (post['_embedded']['wp:featuredmedia']) {
            post.media_url =
              post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes[
                'medium'
              ].source_url;
          }
        }

        return {
          posts: data,
          pages: res['headers'].get('x-wp-totalpages'),
          postsLength: res['headers'].get('x-wp-total'),
        };
      })
    );
  }

  getPostContent(id) {
    return this.http
      .get<any>(environment.apiUrl + 'posts/' + id + '?_embed')
      .pipe(
        map((post) => {
          if (post['_embedded']['wp:featuredmedia']) {
            post.media_url =
              post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes[
                'full'
              ].source_url;
          }
          return post;
        })
      );
  }

  getCategories() {
    return this.http.get<any>(environment.apiUrl + 'categories').pipe(
      map((res) => {
        console.log('Get categories', res);
        const items = [];
        for (let item of res) {
          items.push({
            id: item.id,
            name: item.name,
            slug: item.slug,
            count: item.count,
          });
        }
        return items;
      })
    );
  }

  getPages() {
    return this.http.get<any>(environment.apiUrl + 'pages').pipe(
      map((res) => {
        // const matches = [12,10,3,2];
        const matches = [210, 171, 496];
        const items = [];
        for (let item of res) {
          if (!matches.includes(item.id)) continue;
          items.push({
            url: 'page/' + item.id,
            title: item.title.rendered,
            icon: 'file-tray',
          });
        }
        return items;
      })
    );
  }

  getPageContent(id) {
    return this.http
      .get<any>(environment.apiUrl + 'pages/' + id + '?_embed')
      .pipe(
        map((post) => {
          if (post['_embedded']['wp:featuredmedia']) {
            post.media_url =
              post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes[
                'full'
              ].source_url;
          }
          return post;
        })
      );
  }
}
