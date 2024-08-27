import { Component, OnInit, HostListener } from '@angular/core';
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
export class PokemonListComponent implements OnInit {

  pokemons: Pokemon[] = []; // Liste des Pokémon à afficher
  offset = 0; // Début de la pagination
  limit = 20; // Nombre de Pokémon à charger par requête
  loading = false; // Indicateur pour éviter de déclencher plusieurs requêtes simultanées

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadMorePokemons(); // Charge les premiers Pokémon lors de l'initialisation du composant
  }

  loadMorePokemons(): void {
    if (this.loading) return; // Vérifie si une requête est déjà en cours
    this.loading = true;
    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe((data: Pokemon[]) => {
      this.pokemons = [...this.pokemons, ...data]; // Ajoute les nouveaux Pokémon à la liste existante
      this.offset += this.limit; // Incrémente l'offset pour la prochaine requête
      this.loading = false; // Réinitialise l'indicateur de chargement
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
    const max = document.documentElement.scrollHeight || document.body.scrollHeight;
    if (pos >= max && !this.loading) {
      this.loadMorePokemons(); // Charge plus de Pokémon lorsque l'utilisateur atteint le bas de la page
    }
  }
}
