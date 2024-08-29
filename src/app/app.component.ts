import { Component } from '@angular/core';  // Import de base pour créer un composant Angular
import { RouterOutlet } from '@angular/router';  // Permet de gérer le routage dans Angular
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';  // Import du composant PokemonListComponent
import { TitleCasePipe } from './pipes/title-case.pipe';  // Import de TitleCasePipe, si tu l'utilises pour mettre en forme le texte
import { HeaderComponent } from './components/header/header.component';  // Import du HeaderComponent
import { PokemonFilterComponent } from './components/pokemon-filter/pokemon-filter.component'; // Import du composant PokemonFilterComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PokemonListComponent,
    TitleCasePipe,
    HeaderComponent,
    PokemonFilterComponent  // Ajout du filtre de Pokémon
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Projet_Pokedex';
  searchTerm: string = '';
  selectedType: string = '';

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
  }

  onTypeSelected(type: string) {
    this.selectedType = type.toLowerCase();
  }
}
