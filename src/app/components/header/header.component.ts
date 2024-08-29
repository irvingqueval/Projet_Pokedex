import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonFilterComponent } from '../pokemon-filter/pokemon-filter.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, PokemonFilterComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() search = new EventEmitter<string>();
  @Output() typeSelected = new EventEmitter<string>();

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.search.emit(inputElement.value);
  }

  onTypeSelected(type: string): void {
    this.typeSelected.emit(type);
  }
}
