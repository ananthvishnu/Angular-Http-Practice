import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-httpstart',
  templateUrl: './httpstart.component.html',
  styleUrls: ['./httpstart.component.css'],
})
export class HttpstartComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];//? Array to hold fetched posts
  isFetching = false;//? Flag to track if posts are being fetched
  error: any; //? Variable to hold error messages
  private errorSub!: Subscription; //? Subscription for error handling

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    //? Subscribe to the error subject to handle errors
    this.errorSub = this.postService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });

    this.isFetching = true;
    //? Fetch posts using the postService
    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;//? Update the loadedPosts array
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;//? Display error message
        console.log(error);
      }
    );
  }

  //? Method triggered when creating a new post
  onCreatePost(postData: { title: string; content: string; id: any }) {
    this.postService.createAndStorePost(
      postData.title,
      postData.content,
      postData.id
    );
  }

//? Method triggered when fetching posts
  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    //? Fetch posts using the postService
    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;//? Update the loadedPosts array
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message; //? Display error message
        console.log(error);
      }
    );
  }

//? Method triggered when clearing posts
  onClearPosts() {
   //? Delete posts using the postService
    this.postService.detetePosts().subscribe(() => {
      this.loadedPosts = []; //? Clear the loadedPosts array
    });
  }

  //? Method triggered to clear the error message
  onHandleError() {
    this.error = null;
  }
//? Unsubscribe from error subscription to prevent memory leaks
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
