import Link from "next/link";

export default class PokemonCard extends React.Component {
  render() {
    const { id, name, img, types } = this.props.pokemon;

    return (
      <Link href={`/pokemons?id=${id}`}>
        <a className="pokemon-card">
          <img src={img} />
          <div className="pokemon-data">
            <p className="pokemon-number">{`N° ${"0".repeat(
              3 - id.toString().length
            )}${id}`}</p>
            <h3 className="pokemon-name">{name}</h3>
            {types.map(type => (
              <span className={`pokemon-type pokemon-type-${type}`} key={type}>
                {type}
              </span>
            ))}
          </div>
        </a>
      </Link>
    );
  }
}
