import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  constructor(private router:Router) {}

  doSearch(value:String){
    console.log('You searched for: ' + value);
    this.router.navigateByUrl(`/search/${value}`);
  }

  ngOnInit(): void {
      
  }

}
