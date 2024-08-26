import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemonList(): Observable<Pokemon[]> {
    return this.http.get<any>(`${this.baseUrl}?limit=151`).pipe(
      map(response => response.results), // Récupère seulement les résultats (URLs)
      switchMap((pokemons: any[]) => {
        // Transforme chaque URL en une requête Observable de détails Pokémon
        const requests = pokemons.map(pokemon => this.getPokemonDetails(pokemon.url));
        // Utilise forkJoin pour exécuter toutes les requêtes en parallèle et attendre que toutes soient terminées
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
