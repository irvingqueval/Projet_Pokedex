import { Component, OnInit, OnChanges, HostListener } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { TitleCasePipe } from '../../pipes/title-case.pipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, RouterModule],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  offset = 0;
  limit = 20; // Load in batches of 20 Pokémon
  loading = false;
  maxPokemons = 151; // Maximum number of Pokémon to load

  filter: string = '';
  selectedType: string = '';

  constructor(private pokemonService: PokemonService, private filterService: FilterService) { }

  ngOnInit(): void {
    this.loadMorePokemons();

    // Subscription to filter service observables
    this.filterService.searchTerm$.subscribe(term => {
      this.filter = term;
      this.applyFilter();
    });

    this.filterService.selectedType$.subscribe(type => {
      this.selectedType = type;
      this.applyFilter();
    });

    console.log("Component PokemonList initialized");
    console.log(this.pokemons);
  }

  loadMorePokemons(): void {
    if (this.loading || this.offset >= this.maxPokemons) return; // Prevents charging if there are no Pokémon left to charge
    this.loading = true;

    setTimeout(() => {
      this.pokemonService.getPokemonList(this.offset, this.limit).subscribe((data: Pokemon[]) => {
        this.pokemons = [...this.pokemons, ...data];
        this.offset += this.limit;
        this.loading = false;

        // Ensure that the offset does not exceed the maximum number of Pokémon
        if (this.offset >= this.maxPokemons) {
          this.offset = this.maxPokemons;
        }

        // Reapply filter after loading
        this.applyFilter();
      });
    }, 500);
  }

  applyFilter(): void {
    const searchQuery = this.filter ? this.filter.toLowerCase() : '';
    const selectedType = this.selectedType ? this.selectedType.toLowerCase() : '';

    // Filter previously loaded Pokémon by name and type
    this.filteredPokemons = this.pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery) &&
      (selectedType === '' || pokemon.types.map(type => type.toLowerCase()).includes(selectedType))
    );

    // Load more Pokémon if the filter hasn't found enough results and not all Pokémon have been loaded.
    if (this.filteredPokemons.length < this.limit && this.offset < this.maxPokemons) {
      this.loadMorePokemons(); // Load more Pokémon and reapply the filter
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
    const max = document.documentElement.scrollHeight || document.body.scrollHeight;
    if (pos >= max && !this.loading && this.offset < this.maxPokemons) {
      this.loadMorePokemons(); // Load more Pokémon when you reach the bottom of the page
    }
  }
}