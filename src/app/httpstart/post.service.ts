import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { map, Subject, catchError, throwError, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  //? Subject to handle and broadcast errors
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  //? Method to create and store a new post
  createAndStorePost(title: string, content: string, id: any) {
    const postData: Post = { title: title, content: content, id: id };

    // Send Http request
    // console.log(postData);
    //? Sending an HTTP POST request to store the new post
    this.http
      .post<{}>(
        'https://angularlearning-c4963-default-rtdb.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response', //? Observing the complete response
        }
      )
      .subscribe(
        (responseData) => {
          console.log(responseData.body); //? Logging the response body
        },
        (error) => {
          this.error.next(error.message); // ?Broadcasting error to subscribers
        }
      );
  }

  //? Method to fetch posts from the server
  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty'); //? Adding a query parameter
    searchParams = searchParams.append('custom', 'key'); //? Adding another query parameter

    //? Sending an HTTP GET request to fetch posts
    return this.http
      .get<{ [key: string]: Post }>(
        'https://angularlearning-c4963-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({ 'Custom-Headers': 'Hello' }), //? Setting custom headers
          params: searchParams, //? Attaching query parameters
          responseType: 'json', //? Expecting JSON response
        }
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          //? Converting the response data into an array of Post objects
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          //? Handling errors and possibly sending them for analysis
          return throwError(errorRes);
        })
      );
  }

  //? Method to delete posts from the server
  detetePosts() {
    //? Sending an HTTP DELETE request to delete posts
    return this.http
      .delete(
        'https://angularlearning-c4963-default-rtdb.firebaseio.com/posts.json',
        {
          observe: 'events', //? Observing events during the request
        }
      )
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            //? Handling specific event types
            //...
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body); //? Logging response body
          }
        })
      );
  }
}
