import { createContext, useContext, useState, useCallback } from 'react';
import { ROOMS } from '../data/rooms';
import { calcRoomScore } from '../utils/scoring';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState('');
  const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Tracking detallado por sala
  // Cada entrada: { roomId, levelNum, skill, attempts, chosenOptions, usedHint, timeSeconds, score }
  const [roomResults, setRoomResults] = useState([]);

  // Estado temporal de la sala actual (se resetea entre salas)
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [currentChoices, setCurrentChoices] = useState([]);
  const [currentHintUsed, setCurrentHintUsed] = useState(false);
  const [roomStartTime, setRoomStartTime] = useState(null);

  const currentRoom = ROOMS[currentRoomIdx];

  const startNewRoom = useCallback(() => {
    setCurrentAttempts(0);
    setCurrentChoices([]);
    setCurrentHintUsed(false);
    setRoomStartTime(Date.now());
    // Auto-iniciar startTime si no se ha establecido (protección contra recarga)
    setStartTime(prev => prev || Date.now());
  }, []);

  const registerAttempt = useCallback((optionId) => {
    setCurrentAttempts(prev => prev + 1);
    setCurrentChoices(prev => [...prev, optionId]);
  }, []);

  const registerHint = useCallback(() => {
    setCurrentHintUsed(true);
  }, []);

  const finalizeRoom = useCallback((attempts, choices, usedHint) => {
    const timeSeconds = Math.floor((Date.now() - roomStartTime) / 1000);
    const score = calcRoomScore(attempts, usedHint);

    const result = {
      roomId: currentRoom.id,
      levelNum: currentRoom.level_num,
      skill: currentRoom.skillTested,
      attempts,
      chosenOptions: choices,
      usedHint: usedHint,
      timeSeconds,
      score
    };

    setRoomResults(prev => [...prev, result]);
    return result;
  }, [currentRoom, roomStartTime]);

  const advanceRoom = useCallback(() => {
    setCurrentRoomIdx(prev => prev + 1);
    startNewRoom();
  }, [startNewRoom]);

  const resetGame = useCallback(() => {
    setPlayerName('');
    setCurrentRoomIdx(0);
    setRoomResults([]);
    setStartTime(null);
    setCurrentAttempts(0);
    setCurrentChoices([]);
    setCurrentHintUsed(false);
    setRoomStartTime(null);
  }, []);

  const value = {
    playerName, setPlayerName,
    currentRoomIdx, setCurrentRoomIdx,
    startTime, setStartTime,
    currentRoom, ROOMS,
    roomResults, setRoomResults,

    // Tracking de sala actual
    currentAttempts,
    currentChoices,
    currentHintUsed,
    roomStartTime,

    // Acciones
    startNewRoom,
    registerAttempt,
    registerHint,
    finalizeRoom,
    advanceRoom,
    resetGame
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
