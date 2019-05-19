import Error from "next/error";
import { fetchData } from "../services/api";
import Layout from "../components/Layout";

export default class extends React.Component {
  static async getInitialProps({ query, res }) {
    const { name } = query;

    try {
      const {
        id,
        name: pokeName,
        height,
        weight,
        types,
        sprites: { front_default: img },
        abilities
      } = await fetchData(`https://pokeapi.co/api/v2/pokemon/${name}`);

      return {
        pokemon: {
          id,
          name: pokeName,
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

  render() {
    const { pokemon, statusCode } = this.props;

    if (statusCode !== 200) {
      return <Error statusCode={statusCode} />;
    }

    return (
      <Layout title="Pokedex">
        <div className="pokemon-detail">
          <div className="pokemon-box">
            <img src={pokemon.img} />
          </div>
          <div className="pokemon-buttons">
            <button>Info</button>
            <div className="cross-center">
              <div className="cross-top" />
              <div className="cross-bottom" />
              <div className="cross-left" />
              <div className="cross-right" />
              <div className="cross-circle" />
            </div>
          </div>
          <style jsx>{`
            .pokemon-detail {
              background-color: #ed1e24;
              padding: 20px 30px;
              height: 100%;
            }
            .pokemon-box {
              background-color: black;
              border-width: 30px;
              border-style: solid;
              border-color: grey;
              border-radius: 10px;
              margin-bottom: 50px;
            }
            .pokemon-buttons {
              display: flex;
              justify-content: space-around;
            }
            .pokemon-buttons button {
              background-color: yellow;
              color: black;
              display: inline-block;
              font-size: 1rem;
              font-weight: 900;
              padding: 8px 12px;
              border-radius: 4px;
              border: 3px solid transparent;
            }
            .cross-center {
              background-color: #333333;
              width: 35px;
              height: 35px;
              position: relative;
            }
            .cross-circle {
              background-color: #292929;
              width: 25px;
              height: 25px;
              position: absolute;
              border-radius: 100%;
              margin-top: 5px;
              margin-left: 5px;
            }
            .cross-top {
              background-color: #333333;
              width: 35px;
              height: 35px;
              position: absolute;
              border-radius: 15%;
              margin-top: -30px;
            }
            .cross-bottom {
              background-color: #333333;
              width: 35px;
              height: 35px;
              position: absolute;
              border-radius: 15%;
              margin-top: 30px;
            }
            .cross-left {
              background-color: #333333;
              width: 35px;
              height: 35px;
              position: absolute;
              border-radius: 15%;
              margin-left: -30px;
            }
            .cross-right {
              background-color: #333333;
              width: 35px;
              height: 35px;
              position: absolute;
              border-radius: 15%;
              margin-left: 30px;
            }
          `}</style>
        </div>
      </Layout>
    );
  }
}
