import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Gamepad2, RotateCcw, Trophy } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

interface FunCentreSettings {
  enabled: boolean;
  title: string;
  description: string;
  games: {
    ticTacToe: {
      enabled: boolean;
      title: string;
      description: string;
    };
    memoryGame: {
      enabled: boolean;
      title: string;
      description: string;
    };
  };
}

const FunCentre: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [settings, setSettings] = useState<FunCentreSettings>({
    enabled: true,
    title: "Fun Centre",
    description: "Take a break and enjoy some interactive games while exploring my portfolio!",
    games: {
      ticTacToe: {
        enabled: true,
        title: "Tic Tac Toe",
        description: "Classic Tic Tac Toe game. Challenge yourself!"
      },
      memoryGame: {
        enabled: true,
        title: "Memory Game",
        description: "Test your memory with this card matching game."
      }
    }
  });

  useEffect(() => {
    fetchFunCentreSettings();
  }, []);

  const fetchFunCentreSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fun-centre`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching fun centre settings:', error);
    }
  };

  // Don't render if disabled
  if (!settings.enabled) {
    return null;
  }

  return (
    <section id="fun-centre" className="py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gradient uppercase-spaced">{settings.title}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{settings.description}</p>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {settings.games.ticTacToe.enabled && (
            <Card className="cursor-pointer hover:shadow-dark-lg transition-all duration-300 bg-dark-card backdrop-blur-sm hover-lift" onClick={() => setActiveGame('tic-tac-toe')}>
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  {settings.games.ticTacToe.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{settings.games.ticTacToe.description}</p>
              </CardContent>
            </Card>
          )}

          {settings.games.memoryGame.enabled && (
            <Card className="cursor-pointer hover:shadow-dark-lg transition-all duration-300 bg-dark-card backdrop-blur-sm hover-lift" onClick={() => setActiveGame('memory-game')}>
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Trophy className="w-5 h-5 mr-2" />
                  {settings.games.memoryGame.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{settings.games.memoryGame.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {activeGame === 'tic-tac-toe' && <TicTacToe onClose={() => setActiveGame(null)} />}
        {activeGame === 'memory-game' && <MemoryGame onClose={() => setActiveGame(null)} />}
      </div>
    </section>
  );
};

const TicTacToe: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (board: string[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else if (newBoard.every(cell => cell)) {
      setWinner('Draw');
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Tic Tac Toe
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            {winner ? (
              <p className="text-lg font-semibold">
                {winner === 'Draw' ? 'It\'s a draw!' : `Player ${winner} wins!`}
              </p>
            ) : (
              <p>Current player: {currentPlayer}</p>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {board.map((cell, index) => (
              <button
                key={index}
                className="w-16 h-16 border-2 border-border rounded-md text-2xl font-bold hover:bg-accent"
                onClick={() => handleClick(index)}
              >
                {cell}
              </button>
            ))}
          </div>
          
          <Button onClick={resetGame} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const MemoryGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [cards, setCards] = useState<{ id: number; value: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const initializeGame = () => {
    const values = ['🎯', '🎮', '🎨', '🎭', '🎪', '🎸', '🎺', '🎷'];
    const gameCards = [...values, ...values]
      .map((value, index) => ({ id: index, value, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        setCards(prev => prev.map(card => 
          card.id === first || card.id === second 
            ? { ...card, matched: true }
            : card
        ));
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, flipped: false }
              : card
          ));
        }, 1000);
      }
      
      setFlippedCards([]);
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameComplete(true);
    }
  }, [cards]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(card => card.id === id);
    if (!card || card.flipped || card.matched) return;

    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    ));
    setFlippedCards(prev => [...prev, id]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Memory Game
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p>Moves: {moves}</p>
            {gameComplete && (
              <p className="text-lg font-semibold text-green-600">
                Congratulations! You completed the game in {moves} moves!
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {cards.map((card) => (
              <button
                key={card.id}
                className={`w-16 h-16 border-2 border-border rounded-md text-2xl font-bold transition-all ${
                  card.flipped || card.matched 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary hover:bg-accent'
                }`}
                onClick={() => handleCardClick(card.id)}
                disabled={card.flipped || card.matched}
              >
                {card.flipped || card.matched ? card.value : '?'}
              </button>
            ))}
          </div>
          
          <Button onClick={initializeGame} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunCentre;