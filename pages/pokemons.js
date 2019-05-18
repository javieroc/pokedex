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
      res.statusCode = 503;
      return { pokemon: null, statusCode: 503 };
    }
  }

  render() {
    const { pokemon, statusCode } = this.props;
    console.log("pokemon", pokemon);

    if (statusCode !== 200) {
      return <Error statusCode={statusCode} />;
    }

    return (
      <Layout title="Pokedex">
        <h1>test</h1>
      </Layout>
    );
  }
}
