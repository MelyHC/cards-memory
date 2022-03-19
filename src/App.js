import React, { Component } from 'react';
import suffle from 'shuffle-array';
import data from './dataCards/dataCardsBz.js';
import btnEasy from './BZcartas/Botones/D_DBottonFacil.png';
import btnMedium from './BZcartas/Botones/D_DBottonMedio.png';
import btnHard from './BZcartas/Botones/D_DBottonDificil.png';
import back from './BZcartas/ContraPortada.png';
import gameOver from './BZcartas/GameOver.png';
import './App.css';

class App extends Component {
  state = {
    allCards: [],
    count: 0,
    level: 0,
    cards: [],
    compareCards: []
  }

  comparingCards = (arrCards, currentCount) => {
    const { cards } = this.state;
    const [firstCard, secondCard] = arrCards;

    setTimeout(() => {
      cards.forEach(card => {
        if (firstCard.img === secondCard.img) {
          if (card.index === firstCard.index || card.index === secondCard.index) {
            card.visibility = true;
          }
        } else {
          card.flip = false;
        }
      })

      this.setState({ count: currentCount + 1 })
    }, 1000)

  }

  handleClick = (i) => {
    const { cards } = this.state;
    let { count, compareCards } = this.state;

    cards.forEach(card => {
      if (card.index === i) {
        card.flip = !card.flip;
        if (!compareCards.find(cardCurrent => card === cardCurrent)) {
          compareCards.push(card);
          if (compareCards.length === 2) {
            this.comparingCards(compareCards, count);
            compareCards = [];
          }
        }
      }
    })

    this.setState({ cards, compareCards })
  }

  refreshPage = () => window.location.reload();

  selectLevel = (e) => {
    const { allCards, cards } = this.state;
    e.preventDefault();
    const levelSelected = parseInt(e.target.value);

    while (cards.length < levelSelected) {
      const selectCard = allCards[Math.round(Math.random() * allCards.length)];

      if (!cards.find(card => card === selectCard)) {
        cards.push(selectCard);
        cards.push({ ...selectCard, index: selectCard.index + 1 });
      };
    };

    suffle(cards);

    this.setState({ cards, level: levelSelected })
  }

  componentDidMount() {
    const arrCards = data.map(({ img }, index) => {
      return {
        img,
        visibility: false,
        flip: false,
        index: img + index
      }
    });

    this.setState({ allCards: arrCards })
  }

  render() {
    const { cards, count, level } = this.state;

    if (level === 0) {
      return (
        <div className="home d-flex justify-content-center align-items-center bg-black m-0 p-2">
          <section className="col-11 col-sm-8 col-lg-7 rounded p-0">
            <h2 className="text-center mt-3 text-white stroke">Elige un nivel para comenzar</h2>
            <form onClick={this.selectLevel} className="row mt-4 p-0">
              <input alt="nivel fácil" className="col-xs-12 col-md-6 btn btn-custom" type="image" src={btnEasy} value="8" />
              <input alt="nivel medio" className="col-xs-12 col-md-6 btn btn-custom" type="image" src={btnMedium} value="16" />
              <input alt="nivel difícil" className="col-xs-12 col-md-6 btn btn-custom" type="image" src={btnHard} value="32" />
              <input alt="nivel difícil" className="col-xs-12 col-md-6 btn btn-custom" type="image" src={btnHard} value="64" />
            </form>
          </section>
        </div>
      )
    } else {
      return (
        <div className="home bg-black">
          <header className="d-flex justify-content-between bg-blac text-white">
            <i className="fas fa-undo-alt btn icon-white" onClick={this.refreshPage}></i>
            <h5 className="m-1">N°: {count}</h5>
          </header>
          <div className="container">
            {
              cards.every(cardHide => cardHide.visibility)
                ? <div className="game-over d-flex view justify-content-center align-items-center position-relative">
                  <img className="img-game-over  img-fluid" src={gameOver} alt="" />
                  <section className="rounded pt-5 position-absolute text-white stroke">
                    <h2 className="mt-4 mr-3 mb-0 mt-sm-4 size-custome">Ganaste!</h2>
                    <h5 className="pr-2 size-custome-mini">{count} intentos</h5>
                  </section>
                </div>
                : <div className="row m-0 p-0 view justify-content-center">
                  {
                    cards.map(({ img, visibility, flip, index }, i) =>
                      <div className="col-6 col-sm-4 col-lg-3 my-1 content-card" key={index + i}>
                        <figure className={`card-flip ${flip ? "is-flipped" : null} ${visibility ? "hidden" : null}`} onClick={() => this.handleClick(index)}>
                          <img className="card-face card-face-front img-fluid rounded" src={img} alt={img}></img>
                          <img className="card-face img-fluid rounded" src={back} alt="parte trasera de la carta"></img>
                        </figure>
                      </div>
                    )
                  }
                </div>
            }
          </div>
        </div>
      )
    }
  }
}

export default App;
