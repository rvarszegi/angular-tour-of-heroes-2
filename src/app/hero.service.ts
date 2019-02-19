import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json' })};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';  // URL to web apiék
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(catchError(this.handleError('getHeroes', [])));
  }
  getHero(id: number): Observable<Hero> {
    const url = '$this.heroUrl/${id}';
    return this.http.get<Hero>(url).pipe(tap(_ => this.log('fetched hero id=${id}')));
  }
  private log(message: string) {
    this.messageService.add('HeroService: ${message}');
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  updateHero(hero: Hero) {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(tap(_ => this.log('updated hero id=${hero.id}')),
    catchError(this.handleError<any>('updatedHero')));
  }
  constructor(
    private messageService: MessageService,
    private http: HttpClient) { }
}
