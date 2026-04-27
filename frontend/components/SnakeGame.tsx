import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, GameStatus } from '../types.ts';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED_MS } from '../constants.ts';
import { GlitchText } from './GlitchText.tsx';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  
  const dirRef = useRef<Point>(INITIAL_DIRECTION);
  const nextDirRef = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const isOnSnake = currentSnake.some(
        segment => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    dirRef.current = INITIAL_DIRECTION;
    nextDirRef.current = INITIAL_DIRECTION;
    setScore(0);
    onScoreChange(0);
    setFood(generateFood(INITIAL_SNAKE));
    setStatus(GameStatus.PLAYING);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault(); // Prevent scrolling
      }

      if (status !== GameStatus.PLAYING) {
        if (e.key === ' ' || e.key === 'Enter') {
          startGame();
        }
        return;
      }

      const currentDir = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) nextDirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) nextDirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) nextDirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) nextDirRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, generateFood, onScoreChange]);

  // Game Loop
  useEffect(() => {
    if (status !== GameStatus.PLAYING) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        dirRef.current = nextDirRef.current;
        const head = prevSnake[0];
        const newHead = {
          x: head.x + dirRef.current.x,
          y: head.y + dirRef.current.y,
        };

        // Check Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setStatus(GameStatus.GAME_OVER);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setStatus(GameStatus.GAME_OVER);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED_MS);
    return () => clearInterval(intervalId);
  }, [status, food, generateFood, onScoreChange]);

  return (
    <div className="relative w-full aspect-square border-4 border-cyan-500 bg-dark shadow-[0_0_30px_rgba(0,255,255,0.2)] overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
          backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
        }}
      ></div>

      {/* Game Entities */}
      {status !== GameStatus.IDLE && (
        <>
          {/* Food */}
          <div
            className="absolute bg-magenta-500 shadow-[0_0_10px_#ff00ff] animate-pulse-fast"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute border border-dark ${isHead ? 'bg-cyan-300 z-10' : 'bg-cyan-500 opacity-80'}`}
                style={{
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  boxShadow: isHead ? '0 0 15px #00ffff' : 'none'
                }}
              />
            );
          })}
        </>
      )}

      {/* Overlays */}
      {status === GameStatus.IDLE && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark/80 backdrop-blur-sm z-20">
          <GlitchText text="NEURO-SNAKE" as="h2" className="text-4xl md:text-6xl font-bold text-cyan-400 mb-4" />
          <p className="text-magenta-400 animate-pulse">PRESS [SPACE] TO INITIALIZE</p>
        </div>
      )}

      {status === GameStatus.GAME_OVER && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-magenta-900/40 backdrop-blur-sm z-20 border-4 border-magenta-500">
          <GlitchText text="SYSTEM FAILURE" as="h2" className="text-4xl md:text-6xl font-bold text-magenta-400 mb-2" />
          <div className="text-cyan-400 text-xl mb-6">FINAL SCORE: {score}</div>
          <p className="text-cyan-400 animate-pulse">PRESS [SPACE] TO REBOOT</p>
        </div>
      )}
    </div>
  );
};