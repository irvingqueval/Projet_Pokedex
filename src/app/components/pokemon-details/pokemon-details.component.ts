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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchPokemonDetails(+id);
      } else {
        this.handleError();
      }
    });
  }

  fetchPokemonDetails(id: number): void {
    this.loading = true;

    //Add a delay before loading Pokémon details (not advisors, here it's just to show the aninamation)
    setTimeout(() => {
      this.pokemonService.getPokemonDetailsById(id).subscribe(
        (data: PokemonDetails) => {
          this.pokemon = data;
          this.loading = false;
        },
        () => this.handleError()
      );
    }, 500);
  }

  handleError(): void {
    this.error = true;
    this.loading = false;
  }
}
