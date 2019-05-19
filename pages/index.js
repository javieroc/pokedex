import Error from "next/error";
import { fetchData } from "../services/api";
import Layout from "../components/Layout";
import PokemonCard from "../components/PokemonCard";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      count: props.count,
      pokemons: props.pokemons,
      next: props.next,
      previous: props.previous
    };
  }

  static async getInitialProps({ res }) {
    try {
      const { results, ...others } = await fetchData(
        "https://pokeapi.co/api/v2/pokemon"
      );
      const promises = results.map(({ url }) => fetchData(url));
      const pokemonsRaw = await Promise.all(promises);
      const pokemons = pokemonsRaw.map(e => ({
        id: e.id,
        name: e.name,
        img: e.sprites.front_default,
        types: e.types.map(t => t.type.name)
      }));

      return { pokemons, ...others, statusCode: 200 };
    } catch (e) {
      if (res) {
        res.statusCode = 503;
      }
      return { pokemons: null, statusCode: 503 };
    }
  }

  loadMore = () => {
    const { loading, next } = this.state;

    if (!loading && next) {
      this.setState({ loading: true }, () => {
        this.updatePokemons();
      });
    }
  };

  updatePokemons = async () => {
    const { pokemons, next } = this.state;
    const { results, ...others } = await fetchData(next);
    const promises = results.map(({ url }) => fetchData(url));
    const pokemonsRaw = await Promise.all(promises);
    const pokemonsNews = pokemonsRaw.map(e => ({
      id: e.id,
      name: e.name,
      img: e.sprites.front_default,
      types: e.types.map(t => t.type.name)
    }));

    this.setState({
      loading: false,
      pokemons: [...pokemons, ...pokemonsNews],
      ...others
    });
  };

  render() {
    const { pokemons, loading } = this.state;
    const { statusCode } = this.props;

    if (statusCode !== 200) {
      return <Error statusCode={statusCode} />;
    }

    return (
      <Layout title="Pokedex">
        <div className="pokemons" ref="scrollable">
          {pokemons.map(pokemon => (
            <PokemonCard pokemon={pokemon} key={pokemon.id} />
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <button className="load-more" onClick={this.loadMore}>
            {loading ? "...loading" : "Load More"}
          </button>
        </div>
        <style jsx>{`
          .load-more {
            background-color: #47cf73;
            color: black;
            display: inline-block;
            font-size: 1rem;
            font-weight: 800;
            margin: 10px auto;
            padding: 8px;
            border-radius: 4px;
            border: 3px solid transparent;
          }
        `}</style>
      </Layout>
    );
  }
}
