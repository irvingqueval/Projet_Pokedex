import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { TitleCasePipe } from '../../pipes/title-case.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit, OnChanges {
  pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  offset = 0;
  limit = 151; // Charger tous les Pokémon de la première génération
  loading = false;

  @Input() filter: string = '';

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadPokemons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.applyFilter();
    }
  }

  loadPokemons(): void {
    this.loading = true;
    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe((data: Pokemon[]) => {
      this.pokemons = data;
      this.applyFilter();
      this.loading = false;
    });
  }

  applyFilter(): void {
    if (this.filter) {
      this.filteredPokemons = this.pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.filter)
      );
    } else {
      this.filteredPokemons = [...this.pokemons];
    }
  }
}
