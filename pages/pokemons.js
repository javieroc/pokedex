import Error from "next/error";
import Link from "next/link";
import dynamic from "next/dynamic";
import { fetchData } from "../services/api";
import Layout from "../components/Layout";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      talkifyAvailable: false
    };
  }

  static async getInitialProps({ query, res }) {
    const { id: pokeId } = query;

    try {
      const {
        id,
        name,
        height,
        weight,
        types,
        sprites: { front_default: img },
        abilities
      } = await fetchData(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);

      return {
        pokemon: {
          id,
          name,
          height,
          weight,
          types: types.map(t => t.type.name),
          img,
          abilities: abilities.map(a => a.ability.name)
        },
        statusCode: 200
      };
    } catch (e) {
      if (res) {
        res.statusCode = 503;
      }
      return { pokemon: null, statusCode: 503 };
    }
  }

  componentDidMount() {
    this.setState({ talkifyAvailable: true });
  }

  handleClick = () => {
    const { talkifyAvailable } = this.state;
    if (talkifyAvailable) {
      const { talkify } = window;
      talkify.config.remoteService.apiKey =
        "4afa210e-95e9-459c-8847-b53b25ebe760";
      var player = new talkify.TtsPlayer();
      const {
        pokemon: { id, img, name, height, weight, types, abilities }
      } = this.props;
      player.playText(
        `${name}, this pokemon is of type ${types.join(
          " and "
        )}, its height is aprox ${height} and can reach a weight of ${weight}. His main abilities are ${abilities.join(
          " and "
        )}`
      );
    }
  };

  render() {
    const {
      pokemon: { id, img, name, height, weight, types, abilities },
      statusCode
    } = this.props;

    if (statusCode !== 200) {
      return <Error statusCode={statusCode} />;
    }

    return (
      <Layout title="Pokedex">
        <div className="pokemon-detail">
          <div className="pokemon-box">
            <img src={img} />
            <div className="pokemon-info">
              <h5>{name}</h5>
              <h5>{`N° ${"0".repeat(3 - id.toString().length)}${id}`}</h5>
              <h5>{`Height: ${height}`}</h5>
              <h5>{`Weight: ${weight}`}</h5>
              <h5>{`Type: ${types.join(", ")}`}</h5>
              <h5>{`Abilities: ${abilities.join(", ")}`}</h5>
            </div>
          </div>
          <div className="pokemon-buttons">
            <button onClick={this.handleClick}>Info</button>
            <div className="cross-center">
              <Link href={`/pokemons?id=${id + 1}`}>
                <a>
                  <div className="cross-top" />
                </a>
              </Link>
              <Link href={`/pokemons?id=${id === 1 ? id : id - 1}`}>
                <a>
                  <div className="cross-bottom" />
                </a>
              </Link>
              <Link href={`/pokemons?id=${id === 1 ? id : id - 1}`}>
                <a>
                  <div className="cross-left" />
                </a>
              </Link>
              <Link href={`/pokemons?id=${id + 1}`}>
                <a>
                  <div className="cross-right" />
                </a>
              </Link>
              <div className="cross-circle" />
            </div>
          </div>
          <style jsx>{`
            audio: {
              visibility: hidden;
            }
          `}</style>
        </div>
      </Layout>
    );
  }
}
