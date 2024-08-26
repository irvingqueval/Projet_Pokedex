import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { TitleCasePipe } from '../../pipes/title-case.pipe'; // Assure-toi que ce chemin est correct

@Component({
  selector: 'app-pokemon-list',
  standalone: true,  // Déclare le composant comme autonome
  imports: [
    CommonModule,     // Pour les directives Angular communes (ngIf, ngFor, etc.)
    TitleCasePipe     // Pour le pipe titlecase
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {

  pokemons: Pokemon[] = []; // Tableau pour stocker les Pokémon

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    // Récupère la liste des Pokémon lorsque le composant est initialisé
    this.pokemonService.getPokemonList().subscribe((data: Pokemon[]) => {
      this.pokemons = data; // Stocke les Pokémon dans la variable `pokemons`
    });
  }
}
