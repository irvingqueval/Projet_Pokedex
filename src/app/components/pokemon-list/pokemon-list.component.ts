import { Component, OnInit, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
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
  limit = 20; // Charger par lots de 20 Pokémon
  loading = false;

  @Input() filter: string = '';

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadMorePokemons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.applyFilter();
    }
  }

  loadMorePokemons(): void {
    if (this.loading) return; // Empêche les requêtes multiples en même temps
    this.loading = true;

    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe((data: Pokemon[]) => {
      this.pokemons = [...this.pokemons, ...data]; // Ajouter les nouveaux Pokémon à la liste
      this.applyFilter(); // Appliquer le filtre après chaque chargement de données
      this.offset += this.limit; // Incrémenter l'offset pour la prochaine requête
      this.loading = false; // Terminer le chargement
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

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
    const max = document.documentElement.scrollHeight || document.body.scrollHeight;
    if (pos >= max && !this.loading) {
      this.loadMorePokemons(); // Charger plus de Pokémon lorsqu'on atteint le bas de la page
    }
  }
}
