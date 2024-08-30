import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetails } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})
export class PokemonDetailsComponent implements OnInit {
  pokemon: PokemonDetails | null = null;
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute  // Injecte ActivatedRoute pour accéder aux paramètres de l'URL
  ) {}

  ngOnInit(): void {
    // Récupère l'ID du Pokémon depuis les paramètres de l'URL et charge les détails
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchPokemonDetails(+id);  // Passe directement l'ID à la méthode
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  fetchPokemonDetails(id: number): void {
    this.loading = true;
    this.pokemonService.getPokemonDetailsById(id).subscribe(
      (data: PokemonDetails) => {
        this.pokemon = data;
        this.loading = false;
      },
      error => {
        this.error = true;
        this.loading = false;
      }
    );
  }
}
