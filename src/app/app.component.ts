import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { TitleCasePipe } from './pipes/title-case.pipe';
import { HeaderComponent } from './components/header/header.component';
import { PokemonFilterComponent } from './components/pokemon-filter/pokemon-filter.component';
import { FilterService } from './services/filter.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PokemonListComponent,
    TitleCasePipe,
    HeaderComponent,
    PokemonFilterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Projet_Pokedex';
  searchTerm: string = '';
  selectedType: string = '';

  constructor(private filterService: FilterService) { }

  onSearch(term: string) {
    this.filterService.setSearchTerm(term.toLowerCase());
  }

  onTypeSelected(type: string) {
    this.filterService.setSelectedType(type.toLowerCase());
  }
}
