import React, { Component, Fragment } from 'react';
import './App.css';
import data from './dataCards/dataCards.json';
import back from './back.PNG';
import suffle from 'shuffle-array';

class App extends Component {
  state = {
    allCards: [],
    count: 0,
    level: null,
    cards: [],
    compareCards: []
  }

  comparingCards = (arrCards, currentCount) => {
    let { compareCards } = this.state;
    const { cards } = this.state;
    cards.forEach(card => {
      arrCards.forEach(currentCard => {
        if(card.img === currentCard.img) {
          card.visibility = true;
        } else {
          card.flip = false
        }
      })
    })

    compareCards = [];
    this.setState({ count: currentCount++, compareCards })
  }

  handleClick = (i) => {
    const { cards, compareCards } = this.state;
    let { count } = this.state;

    cards.forEach(card => {
      if (card.index === i) {
        card.flip = !card.flip;
        if (!compareCards.find(cardCurrent => card === cardCurrent)) {
          compareCards.push(card);
          if (compareCards.length+1 <3) {
            this.comparingCards(compareCards, count)
          }
        }
      }
    })

    this.setState({ cards })
  }

  refreshPage = () => window.location.reload();

  componentWillMount() {
    const { cards } = this.state;

    const arrCards = data.map(({ name, img }, index) => {
      return {
        name,
        img,
        visibility: false,
        flip: false,
        index: name + index
      }
    });

    while (cards.length < 8) {
      const selectCard = arrCards[Math.round(Math.random() * arrCards.length)];
      if (!cards.find(card => card === selectCard)) {
        cards.push(selectCard);
        cards.push({ ...selectCard, index: selectCard.index + 1 });
      }
    }

    suffle(cards)

    this.setState({ allCards: data, cards })
  }

  render() {
    const { cards, count } = this.state;

    return (
      <Fragment>
        <header className="d-flex justify-content-between bg-black text-white">
          <i className="fas fa-undo-alt btn" onClick={this.refreshPage} ></i>
          <h4 className="d-inline-block text-center">Cards Memory</h4>
          <h5 className="m-1">N°: {count}</h5>
        </header>
        <div className="modal" tabIndex="-1" role="dialog" aria-hidden="false">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal title</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                ...
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row m-0 p-0 view justify-content-center">
            {
              cards.map(({ name, img, visibility, flip, index }, i) =>
                <div className="col-6 col-sm-4 col-md-3 my-1 content-card" key={index + i}>
                  <figure className={`card-flip ${flip ? "is-flipped" : null}`} onClick={() => this.handleClick(index)}>
                    <img className="card-face card-face-front img-fluid rounded" src={img} alt={name}></img>
                    <img className="card-face img-fluid rounded" src={back} alt="parte trasera de la carta"></img>
                  </figure>
                </div>
              )
            }
          </div>
        </div>

      </Fragment>
    );
  }
}

export default App;
