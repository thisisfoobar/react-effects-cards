import { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import "./CardDeck.css"

const DECK_BASE_URL = "https://deckofcardsapi.com/api/deck/";

const CardDeck = () => {
  const [deckInfo, setDeckInfo] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [cardsRemaining, setCardsRemaining] = useState(true);

  useEffect(function getDeckId() {
    async function fetchDeck() {
      const deck = await axios.get(`${DECK_BASE_URL}/new/shuffle`);
      setDeckInfo(deck.data);
    }
    fetchDeck();
  }, []);

  async function draw() {
    try {
      const drawCardRes = await axios.get(
        `${DECK_BASE_URL}/${deckInfo.deck_id}/draw?count=1`
      );

      if (drawCardRes.data.remaining === 0) {
        setCardsRemaining(false);
        throw new Error("Error: no cards remaining!");
      }

      const card = drawCardRes.data.cards[0];

      setDrawn((d) => [
        ...d,
        {
          id: card.code,
          name: card.value + " " + card.suit,
          image: card.image,
        },
      ]);
    } catch (err) {
      alert(err);
    }
  }

  async function shuffleCards() {
    setIsShuffling(true);
    try {
      await axios.get(`${DECK_BASE_URL}/${deckInfo.deck_id}/shuffle`);
      setDrawn([]);
    } catch (err) {
      alert(err);
    } finally {
      setIsShuffling(false);
      setCardsRemaining(true);
    }
  }

  const showShuffleButton = () => {
    if (!deckInfo) return null;

    return (
      <button className="CardDeck-Button" onClick={shuffleCards} disabled={isShuffling}>
        Shuffle
      </button>
    );
  };

  const showDrawButton = () => {
    if (!deckInfo || !cardsRemaining) return null;

    return (
      <button className="CardDeck-Button" onClick={draw} disabled={isShuffling}>
        Draw!
      </button>
    );
  };

  return (
    <div className="CardDeck">
      <h1>Let's play cards!</h1>
      {showDrawButton()}
      {showShuffleButton()}
      
      <div className='CardDeck-cardarea'>
        {drawn.map((c) => (
          <Card key={c.id} name={c.name} image={c.image} />
        ))}
      </div>
    </div>
  );
};

export default CardDeck;
