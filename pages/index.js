import ReactDOM from "react-dom";
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
      res.statusCode = 503;
      return { pokemons: null, statusCode: 503 };
    }
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.scrollable).addEventListener(
      "scroll",
      this.handleScroll,
      false
    );
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this.refs.scrollable).removeEventListener(
      "scroll",
      this.handleScroll,
      false
    );
  }

  handleScroll = () => {
    const { loading, next } = this.state;
    const node = ReactDOM.findDOMNode(this.refs.scrollable);

    if (
      node.scrollTop + node.offsetHeight + 20 >= node.scrollHeight &&
      !loading &&
      next
    ) {
      console.log("dsasdasda");
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
        {loading && <h3 className="loading">Loading...</h3>}
        <style jsx>{`
          .loading {
            text-align: center;
          }
        `}</style>
      </Layout>
    );
  }
}
