import Error from "next/error";
import { fetchData } from "../services/api";
import Layout from "../components/Layout";
import PokemonCard from "../components/PokemonCard";

export default class extends React.Component {
  static async getInitialProps({ res }) {
    try {
      const { results } = await fetchData("https://pokeapi.co/api/v2/pokemon");
      const promises = results.map(({ url }) => fetchData(url));
      const pokemonsRaw = await Promise.all(promises);
      const pokemons = pokemonsRaw.map(e => ({
        id: e.id,
        name: e.name,
        img: e.sprites.front_default,
        types: e.types.map(t => t.type.name)
      }));

      return { pokemons, statusCode: 200 };
    } catch (e) {
      res.statusCode = 503;
      return { pokemons: null, statusCode: 503 };
    }
  }

  render() {
    const { pokemons } = this.props;

    return (
      <Layout title="Pokedex">
        <div className="pokemons">
          {pokemons.map(pokemon => (
            <PokemonCard pokemon={pokemon} key={pokemon.id} />
          ))}
        </div>
      </Layout>
    );
  }
}
