import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-filter.component.html',
  styleUrls: ['./pokemon-filter.component.css']
})
export class PokemonFilterComponent {
  types: string[] = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
    'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock',
    'Ghost', 'Dark', 'Dragon', 'Steel', 'Fairy'
  ];

  selectedType: string = '';
  @Output() typeSelected = new EventEmitter<string>();

  onTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.selectedType = value;
    this.typeSelected.emit(this.selectedType);
  }
}
