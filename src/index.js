import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     render() {
//         return (
//             <button
//                 className="square"
//                 onClick={() => this.props.onClick()}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

// Change the Square to be a function component:
// In React, function components are a simpler way to write components
// that only contain a render method and don’t have their own state.
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        // We split the returned element into multiple lines for readability,
        // and added parentheses so that JavaScript doesn’t insert a semicolon
        // after return and break our code.
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        // In JavaScript classes, you need to always call super when defining the constructor of a subclass.
        // All React component classes that have a constructor should start with a super(props) call.
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        // We call .slice() to create a copy of the squares array to modify
        // instead of modifying the existing array.
        const squares = current.squares.slice();
        //  to return early by ignoring a click if someone has won the game
        // or if a Square is already filled.
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            // Concatenate new history entries onto history.
            // Unlike the array push() method you might be more familiar with,
            // the concat() method doesn’t mutate the original array, so we prefer it.
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        // Notice in jumpTo method, we haven’t updated history property of the state.
        // That is because state updates are merged or in more simple words
        // React will update only the properties mentioned in setState method
        // leaving the remaining state as that is.
        this.setState({
            stepNumber: step,
            // Set xIsNext to true if the number that we’re changing stepNumber to is even.
            xIsNext: (step % 2)  === 0,
        });
    }

    render() {
        // to use the most recent history entry to determine and display the game’s status:
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // Map over the `history`.
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                // It’s strongly recommended that you assign proper keys
                // whenever you build dynamic lists.
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    // Show when the game is won and there are no more turns to make.
    // Given an array of 9 squares, this function will check for a winner
    // and return 'X', 'O', or null as appropriate.
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]; // e.g. [a, b, c] = [0, 1, 2]
        // e.g. squares[0] is 'X', squares[b] and squares[c] are 'X'
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
