import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-filter.component.html',
  styleUrls: ['./pokemon-filter.component.css']
})
export class PokemonFilterComponent implements OnInit {
  types: string[] = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
    'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock',
    'Ghost', 'Dark', 'Dragon', 'Steel', 'Fairy'
  ];

  selectedType: string = '';
  @Output() typeSelected = new EventEmitter<string>();

  ngOnInit(): void {}

  onTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.selectedType = value;
    this.typeSelected.emit(this.selectedType);
  }
}
