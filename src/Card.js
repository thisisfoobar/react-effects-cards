import "./Card.css"

function Card({name, image}) {
  return <img className="Card" src={image} alt={name} />;
}

export default Card;