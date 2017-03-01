var StarsFrame = React.createClass({
  render: function() {
    var stars = [];
    for (var i=0; i<this.props.numberOfStars; i++) {
      stars.push(
        <span className="glyphicon glyphicon-star"></span>
      );
    }
    
    return (
      <div id="stars-frame">
        <div className="well">
            {stars}
        </div>
      </div>
    )
  }
})

var ButtonFrame = React.createClass({
  render: function() {
    var disabled, button, correct;
    correct = this.props.correct;
    
    switch (correct) {
      case true:
        button = (
            <button className="btn btn-success" onClick={this.props.acceptAnswer}> 
              <span className="glyphicon glyphicon-ok"></span>
            </button>
          );
        break;
      case false:
        button = (
              <button className="btn btn-danger"> 
                <span className="glyphicon glyphicon-remove"></span>
              </button>
            );
        break;
      default:
        disabled = (this.props.selectedNumbers.length === 0);
        button = (
          <button className="btn btn-primary" disabled={disabled}
                  onClick={this.props.checkAnswer}> 
            = 
          </button>
        );
    }
    
    return (
      <div id="button-frame">
        {button}
        <br/><br/>
        <button className="btn btn-warning btn-xs" onClick={this.props.redraw} >
          <span className="glyphicon glyphicon-refresh"></span>
          &nbsp;
          {this.props.redraws}
        </button>
      </div>
    )
  }
})

var AnswerFrame = React.createClass({
  render: function() {
    var props = this.props;
    var selectedNumbers = props.selectedNumbers.map(function(n){
      return (
        <span onClick={props.unselectNumber.bind(null, n)}>{n}</span>
      );
    });
    return (
      <div id="answer-frame">
        <div className="well">
          {selectedNumbers}
        </div>
      </div>
    )
  }
})

var NumbersFrame = React.createClass({
  render: function() {
    var numbers = [], className, 
        selectNumber = this.props.selectNumber,
        selectedNumbers = this.props.selectedNumbers,
        usedNumbers = this.props.usedNumbers;
    for (var i=1; i<=9; i++) {
      className = "number selected-" + (selectedNumbers.indexOf(i)>=0);
      className += " used-" + (usedNumbers.indexOf(i)>=0);
      numbers.push(
        <div className={className} onClick={selectNumber.bind(null, i)}>
          {i}
        </div>
      );
    }
    return (
      <div id="numbers-frame">
        <div className="well">
          {numbers}
        </div>
      </div>
    )
  }
})

var Game = React.createClass({
  getInitialState: function() {
    return {
      numberOfStars: Math.floor(Math.random() * 9) + 1,
      selectedNumbers: [],
      usedNumbers: [],
      redraws: 5,
      correct: null
    }
  },
  selectNumber: function(clickedNumber) {
    if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
      this.setState({
        selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
        correct: null
      });
    }
  },
  unselectNumber: function(clickedNumber) {
    var selectedNumbers = this.state.selectedNumbers,
        indexOfNumber = selectedNumbers.indexOf(clickedNumber);
    selectedNumbers.splice(indexOfNumber, 1);
    this.setState({
      selectedNumbers: selectedNumbers,
      correct: null
    });
  },
  sumOfSelectedNumbers: function() {
    return this.state.selectedNumbers.reduce(function(p, n) {
      return p+n;
    }, 0);
  },
  checkAnswer: function() {
    var result = this.state.numberOfStars === this.sumOfSelectedNumbers();
    this.setState({correct: result});
  },
  acceptAnswer: function() {
    var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
    this.setState({
      numberOfStars: Math.floor(Math.random() * 9) + 1,
      selectedNumbers: [],
      usedNumbers: usedNumbers,
      correct: null
    });
  },
  redraw: function() {
    if (this.state.redraws > 0) {
      this.setState({
        numberOfStars: Math.floor(Math.random() * 9) + 1,
        selectedNumbers: [],
        correct: null,
        redraws: this.state.redraws - 1
      });
    }
  },
  render: function() {
    var selectedNumbers = this.state.selectedNumbers,
        numberOfStars = this.state.numberOfStars,
        usedNumbers = this.state.usedNumbers,
        redraws = this.state.redraws,
        correct = this.state.correct;
    return (
      <div id="game">
        <h2>Play Nine</h2>
        <hr/>
        <div className="clearfix">
          <StarsFrame numberOfStars={numberOfStars}/>
          <ButtonFrame selectedNumbers={selectedNumbers}
                       correct={correct} 
                       checkAnswer={this.checkAnswer}
                       acceptAnswer={this.acceptAnswer}
                       redraw={this.redraw}
                       redraws={redraws} />
          <AnswerFrame selectedNumbers={selectedNumbers}
                       unselectNumber={this.unselectNumber}/>
        </div>
        <NumbersFrame selectedNumbers={selectedNumbers}
                      selectNumber={this.selectNumber}
                      usedNumbers={usedNumbers}
                       />
      </div>
    )
  }
})

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);
