import { Component, OnInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';  // Import des fonctionnalités de base d'Angular
import { PokemonService } from '../../services/pokemon.service';  // Service pour récupérer les données des Pokémon
import { Pokemon } from '../../models/pokemon.model';  // Modèle pour représenter un Pokémon
import { TitleCasePipe } from '../../pipes/title-case.pipe';  // Pipe pour transformer du texte en Title Case (optionnel)
import { CommonModule } from '@angular/common';  // Module pour les fonctionnalités communes d'Angular
import { RouterModule } from '@angular/router';
import { FilterService } from '../../services/filter.service';  // Import du service de filtre

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, RouterModule],  // Import des modules et pipes utilisés par le composant
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

  filter: string = '';
  selectedType: string = '';

  constructor(private pokemonService: PokemonService, private filterService: FilterService) { }

  ngOnInit(): void {
    this.loadMorePokemons();

    // Abonnement aux observables du service de filtre
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

  ngOnChanges(changes: SimpleChanges): void {
    // Plus nécessaire car nous utilisons le service de filtre
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
    const searchQuery = this.filter ? this.filter.toLowerCase() : '';  // S'assurer que filter n'est pas undefined
    const selectedType = this.selectedType ? this.selectedType.toLowerCase() : '';  // S'assurer que selectedType n'est pas undefined

    // Filtrer les Pokémon déjà chargés par nom et par type
    this.filteredPokemons = this.pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery) &&
        (selectedType === '' || pokemon.types.map(type => type.toLowerCase()).includes(selectedType))
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
