import React, { Component } from 'react';
import suffle from 'shuffle-array';
import data from './dataCards/dataCardsBz.js';
import { getLocalStorage } from './utils/localStorage.js';
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
  };

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
      });

      localStorage.setItem('bz-count', JSON.stringify(currentCount + 1));
      localStorage.setItem('bz-cards', JSON.stringify(cards));
      this.setState({ count: currentCount + 1 })
    }, 900);
  };

  handleClick = (i) => {
    const { cards } = this.state;
    let { count, compareCards } = this.state;

    cards.forEach(card => {
      if (card.index === i) {
        card.flip = !card.flip;
        if (!compareCards.find(({ index }) => index === card.index) && card.flip) {
          compareCards.push(card);

          if (compareCards.length === 2) {
            this.comparingCards(compareCards, count);
            compareCards = [];
          };
        } else {
          const indexCardCompare = compareCards.findIndex(({ index }) => index === card.index);
          compareCards.splice(indexCardCompare, 1);
        }
      };
    });

    localStorage.setItem('bz-cards', JSON.stringify(cards));
    localStorage.setItem('bz-compare-cards', JSON.stringify(compareCards));
    this.setState({ cards, compareCards })
  };

  randomNum = () => {
    const { allCards } = this.state
    const num = Math.round(Math.random() * allCards.length);

    if (num >= allCards.length)
      return this.randomNum();

    return num;
  };

  refreshPage = () => {
    window.location.reload();

    localStorage.removeItem('bz-cards');
    localStorage.removeItem('bz-compare-cards');
    localStorage.removeItem('bz-count');
    localStorage.removeItem('bz-level');
  };

  selectLevel = (e) => {
    const { allCards, cards } = this.state;
    e.preventDefault();
    const levelSelected = parseInt(e.target.value);

    while (cards.length < levelSelected) {
      const selectCard = allCards[this.randomNum()];

      if (!cards.find(card => card === selectCard)) {
        cards.push(selectCard);
        cards.push({ ...selectCard, index: selectCard.index + 1 });
      };
    };

    suffle(cards);

    localStorage.setItem('bz-cards', JSON.stringify(cards));
    localStorage.setItem('bz-level', JSON.stringify(levelSelected));
    this.setState({ cards, level: levelSelected })
  };

  componentDidMount() {
    this.loadCards();
    this.getSetStateLocalStorage();
  };

  render() {
    const { cards, count, level } = this.state;

    if (level === 0) {
      return (
        <div className="home d-flex justify-content-center align-items-center bg-black m-0 p-2">
          <section className="col-11 col-sm-8 col-lg-7 rounded p-0">
            <h1 className="text-center mt-3 text-white stroke">Elige un nivel para comenzar</h1>
            <form onClick={this.selectLevel} className="row mt-4 p-0">
              <input alt="nivel fácil" className="col-xs-12 col-md-6 btn btn-custom" type="image" src={btnEasy} value="8" />
              <input alt="nivel medio" className="col-xs-12 col-md-6 btn btn-custom" type="image" src={btnMedium} value="16" />
              <input alt="nivel difícil" className="col-xs-12 col-md-6 btn btn-custom" type="image" src={btnHard} value="32" />
              <input alt="nivel difícil" className="col-xs-12 col-md-6 btn btn-custom" type="image" src={btnHard} value="64" />
            </form>
          </section>
        </div>
      );
    } else {
      return (
        <div className="home bg-black">
          <header className="d-flex justify-content-between text-white">
            <i className="fas fa-undo-alt btn icon-custom stroke" onClick={this.refreshPage}></i>
            <h3 className="m-1 stroke">N°: {count}</h3>
          </header>
          <div className="container">
            {
              cards.every(cardHide => cardHide.visibility)
                ? <div className="game-over d-flex view justify-content-center align-items-center position-relative">
                  <img className="img-game-over  img-fluid" src={gameOver} alt="" />
                  <section className="rounded pt-5 position-absolute text-white stroke">
                    <h2 className="mt-4 mr-3 mb-0 mt-sm-4 size-custom">Ganaste!</h2>
                    <h5 className="pr-2 size-custom-mini">{count} intentos</h5>
                  </section>
                </div>
                : <div
                  className="row m-0 p-0 view justify-content-center"
                  ref={div => this.div = div}
                >
                  {
                    cards.map(({ img, visibility, flip, index }, i) =>
                      <div className="col-6 col-sm-4 col-lg-3 my-1 content-car" key={i} style={this.scaleCards()}>
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
      );
    }
  };

  convertPxRem = (num) => Math.floor(num / 16);


  scaleCards = () => {
    const widthScreen = window.innerWidth;

    let widthCard = 0;
    let heightCard = 0;

    if (widthScreen < 576) {
      console.log('0')
      widthCard = this.convertPxRem(widthScreen / 2);
      heightCard = widthCard * 1.3

    } else if (widthScreen >= 1200) {
      console.log('1200', widthScreen)
      widthCard = this.convertPxRem(widthScreen / 6.8);
      heightCard = widthCard * 1.6

    } else if (widthScreen >= 992) {
      console.log('992')
      widthCard = this.convertPxRem(widthScreen / 4);
      heightCard = widthCard * 1.4

    } else if (widthScreen >= 576) {
      console.log('576')
      widthCard = this.convertPxRem(widthScreen / 3);
      heightCard = widthCard * 1.4
    }

    return {
      width: `${widthCard}rem`,
      height: `${heightCard}rem`,
      // position: 'relative'
    };
  };

  getSetStateLocalStorage = () => {
    const cards = getLocalStorage('bz-cards');
    const compareCards = getLocalStorage('bz-compare-cards');
    const count = getLocalStorage('bz-count');
    const level = getLocalStorage('bz-level');

    if (cards)
      this.setState({ cards });

    if (compareCards)
      this.setState({ compareCards });

    if (count)
      this.setState({ count });

    if (level)
      this.setState({ level });
  };

  loadCards = () => {
    const arrCards = data.map(({ img }, index) => {
      return {
        img,
        visibility: false,
        flip: false,
        index: img + index
      };
    });

    this.setState({ allCards: arrCards });
  };
};

export default App;
