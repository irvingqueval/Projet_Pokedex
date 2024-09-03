import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Pokemon, PokemonDetails } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  // Retrieves a Pokémon list with pagination
  getPokemonList(offset: number, limit: number): Observable<Pokemon[]> {
    const maxLimit = 151;
    if (offset + limit > maxLimit) {
      limit = maxLimit - offset;
    }

    return this.http.get<any>(`${this.baseUrl}?offset=${offset}&limit=${limit}`).pipe(
      map(response => response.results),
      switchMap((pokemons: any[]) => {
        const requests = pokemons.map(pokemon => this.getPokemonDetails(pokemon.url));
        return forkJoin(requests);
      })
    );
  }

  // Retrieves Pokémon details via URL
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

  // Retrieves Pokémon details by ID
  getPokemonDetailsById(id: number): Observable<PokemonDetails> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(details => ({
        id: details.id,
        name: details.name,
        sprite: details.sprites.front_default,
        types: details.types.map((typeInfo: any) => typeInfo.type.name),
        height: details.height,
        weight: details.weight,
        stats: details.stats.map((statInfo: any) => ({
          name: statInfo.stat.name,
          value: statInfo.base_stat
        }))
      }))
    );
  }
}
