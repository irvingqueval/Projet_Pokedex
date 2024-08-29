import { Component, OnInit, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';  // Import des fonctionnalités de base d'Angular
import { PokemonService } from '../../services/pokemon.service';  // Service pour récupérer les données des Pokémon
import { Pokemon } from '../../models/pokemon.model';  // Modèle pour représenter un Pokémon
import { TitleCasePipe } from '../../pipes/title-case.pipe';  // Pipe pour transformer du texte en Title Case (optionnel)
import { CommonModule } from '@angular/common';  // Module pour les fonctionnalités communes d'Angular

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],  // Import des modules et pipes utilisés par le composant
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit, OnChanges {
  pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  offset = 0;
  limit = 20; // Charger par lots de 20 Pokémon
  loading = false;
  maxPokemons = 151; // Nombre maximum de Pokémon à charger

  @Input() filter: string = '';
  @Input() selectedType: string = ''; // Type de Pokémon sélectionné

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadMorePokemons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] || changes['selectedType']) {
      if (this.filter.length >= 2 || this.selectedType) {
        this.filteredPokemons = []; // Réinitialiser les résultats filtrés
        this.applyFilter();
      } else if (!this.filter || this.filter.length < 2) {
        this.filteredPokemons = [...this.pokemons]; // Afficher tous les Pokémon si le filtre a moins de 2 caractères
      }
    }
  }

  loadMorePokemons(): void {
    if (this.loading || this.offset >= this.maxPokemons) return; // Empêche le chargement s'il n'y a plus de Pokémon à charger
    this.loading = true;

    setTimeout(() => {
      this.pokemonService.getPokemonList(this.offset, this.limit).subscribe((data: Pokemon[]) => {
        this.pokemons = [...this.pokemons, ...data];
        this.offset += this.limit;
        this.loading = false;

        // S'assurer que l'offset ne dépasse pas le nombre maximum de Pokémon
        if (this.offset >= this.maxPokemons) {
          this.offset = this.maxPokemons;
        }

        // Réappliquer le filtre après le chargement
        this.applyFilter();
      });
    }, 500);
  }

  applyFilter(): void {
    const searchQuery = this.filter.toLowerCase();

    // Filtrer les Pokémon déjà chargés par nom et par type
    this.filteredPokemons = this.pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery) &&
      (this.selectedType === '' || pokemon.types.includes(this.selectedType))
    );

    // Charger plus de Pokémon si le filtre n'a pas trouvé assez de résultats et si tous les Pokémon ne sont pas encore chargés
    if (this.filteredPokemons.length < this.limit && this.offset < this.maxPokemons) {
      this.loadMorePokemons(); // Charger plus de Pokémon et réappliquer le filtre
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
    const max = document.documentElement.scrollHeight || document.body.scrollHeight;
    if (pos >= max && !this.loading && this.offset < this.maxPokemons) {
      this.loadMorePokemons(); // Charger plus de Pokémon lorsqu'on atteint le bas de la page
    }
  }
}
