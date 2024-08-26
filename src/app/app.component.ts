import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { TitleCasePipe } from './pipes/title-case.pipe';  // Assure-toi que l'import est correct

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PokemonListComponent,  // Composant autonome
    CommonModule,          // Pour les directives et pipes communs d'Angular
    TitleCasePipe          // Importation du pipe autonome
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Projet_Pokedex';
}
