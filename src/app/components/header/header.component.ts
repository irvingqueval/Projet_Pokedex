import { Component, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import de RouterModule
import { PokemonFilterComponent } from '../pokemon-filter/pokemon-filter.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, PokemonFilterComponent], // Ajout de RouterModule dans imports
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() search = new EventEmitter<string>();
  @Output() typeSelected = new EventEmitter<string>();
  showSearchAndFilter: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(() => {
      // Masquer la barre de recherche et le filtre sur la page de détails
      this.showSearchAndFilter = !this.router.url.includes('/pokemon/');
    });
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.search.emit(inputElement.value);
  }

  onTypeSelected(type: string): void {
    this.typeSelected.emit(type);
  }
}
