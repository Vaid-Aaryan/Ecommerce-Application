import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { response } from 'express';
import { start } from 'repl';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root',
})
export class CheckoutFormService implements OnInit {
  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';
  constructor(private httpClient:HttpClient) {}
  ngOnInit(): void {}

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(theCountryCode:String): Observable<State[]>{
    const searchUrl=`${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for(let theMonth =startMonth; theMonth <=12; theMonth++){
      data.push(theMonth);
    }

    return new Observable<number[]>(subscriber => {
      subscriber.next(data);
      subscriber.complete();
    });
  }

  getCreditCardYears() : Observable<number[]> {
    let data: number[] = [];

    const startYear: number=new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear=startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }
}


interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}
