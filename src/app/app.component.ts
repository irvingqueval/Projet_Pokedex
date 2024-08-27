import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { TitleCasePipe } from './pipes/title-case.pipe';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PokemonListComponent,
    TitleCasePipe,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Projet_Pokedex';
  searchTerm: string = ''; // Stocke le terme de recherche

  // Méthode pour mettre à jour le terme de recherche
  onSearch(term: string) {
    this.searchTerm = term.toLowerCase(); // Convertit le terme en minuscules pour une recherche insensible à la casse
  }
}
