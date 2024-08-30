export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export interface PokemonDetails extends Pokemon {
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
}
