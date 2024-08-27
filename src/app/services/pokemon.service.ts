import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private baseUrl = 'https://pokeapi.co/api/v2/pokemon'; // URL de base pour l'API Pokémon

  constructor(private http: HttpClient) { }

  getPokemonList(offset: number, limit: number): Observable<Pokemon[]> {
    const maxLimit = 151;
    if (offset + limit > maxLimit) {
      limit = maxLimit - offset; // Ajuste la limite pour ne pas dépasser 151
    }

    return this.http.get<any>(`${this.baseUrl}?offset=${offset}&limit=${limit}`).pipe(
      map(response => response.results),
      switchMap((pokemons: any[]) => {
        const requests = pokemons.map(pokemon => this.getPokemonDetails(pokemon.url));
        return forkJoin(requests);
      })
    );
  }


  private getPokemonDetails(url: string): Observable<Pokemon> {
    return this.http.get<any>(url).pipe(
      map(details => ({
        id: details.id,
        name: details.name,
        sprite: details.sprites.front_default,
        types: details.types.map((typeInfo: any) => typeInfo.type.name)
      }))
    );
  }
}
