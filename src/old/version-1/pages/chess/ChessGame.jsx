import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./ChessGame.css";

// Sounds
const voiceRight = new Audio("/sounds/boom.mp3");
const sfxRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");
const voiceWrong = new Audio("/sounds/try-again.mp3");
const tapSound = new Audio("/sounds/tap.mp3");

[sfxRight, sfxWrong, voiceRight, voiceWrong, tapSound].forEach(
  (sfx) => (sfx.volume = 1)
);

const play = (audio) => {
  audio.currentTime = 0;
  audio.play().catch((e) => console.warn("Audio play failed", e));
};

const twin = (a, b) => {
  play(a);
  play(b);
};

const pieceEmojis = {
  rook: "🐘",
  pawn: "👦",
  queen: "👸",
  knight: "🐴",
  bishop: "🙏",
};

export default function ChessGame() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [win, setWin] = useState(false);
  const [kicking, setKicking] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState("rook");
  const [kickPos, setKickPos] = useState(null);
  const [fallingPawn, setFallingPawn] = useState(null);
  const [impactEmoji, setImpactEmoji] = useState(null);

  const resetGame = () => {
    let attacker, pawn;

    do {
      attacker = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
      pawn = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
      if (selectedPiece === "bishop") {
        const colorA = (attacker[0] + attacker[1]) % 2;
        const colorB = (pawn[0] + pawn[1]) % 2;
        if (colorA !== colorB) continue;
      }
    } while (attacker[0] === pawn[0] && attacker[1] === pawn[1]);

    const newBoard = Array(4)
      .fill(null)
      .map(() => Array(4).fill(null));
    newBoard[attacker[0]][attacker[1]] = selectedPiece;
    newBoard[pawn[0]][pawn[1]] = "pawn";
    setBoard(newBoard);
    setSelected(null);
    setValidMoves([]);
    setWin(false);
    setKicking(false);
    setKickPos(null);
    setFallingPawn(null);
    setImpactEmoji(null);
  };

  useEffect(() => {
    resetGame();
  }, [selectedPiece]);

  const getValidMoves = (piece, row, col) => {
    const moves = [];
    if (piece === "rook") {
      for (let i = 0; i < 4; i++) {
        if (i !== row) moves.push(`${i}-${col}`);
        if (i !== col) moves.push(`${row}-${i}`);
      }
    } else if (piece === "queen") {
      for (let i = 0; i < 4; i++) {
        if (i !== row) moves.push(`${i}-${col}`);
        if (i !== col) moves.push(`${row}-${i}`);
      }
      for (let i = 1; i < 4; i++) {
        if (row + i < 4 && col + i < 4) moves.push(`${row + i}-${col + i}`);
        if (row - i >= 0 && col - i >= 0) moves.push(`${row - i}-${col - i}`);
        if (row + i < 4 && col - i >= 0) moves.push(`${row + i}-${col - i}`);
        if (row - i >= 0 && col + i < 4) moves.push(`${row - i}-${col + i}`);
      }
    } else if (piece === "bishop") {
      for (let i = 1; i < 4; i++) {
        if (row + i < 4 && col + i < 4) moves.push(`${row + i}-${col + i}`);
        if (row - i >= 0 && col - i >= 0) moves.push(`${row - i}-${col - i}`);
        if (row + i < 4 && col - i >= 0) moves.push(`${row + i}-${col - i}`);
        if (row - i >= 0 && col + i < 4) moves.push(`${row - i}-${col + i}`);
      }
    } else if (piece === "knight") {
      const directions = [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2],
      ];
      directions.forEach(([dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
          moves.push(`${newRow}-${newCol}`);
        }
      });
    }
    return moves;
  };

  const handleSquareClick = (row, col) => {
    if (win || kicking) return;
    play(tapSound);

    const piece = board[row][col];
    const moveKey = `${row}-${col}`;

    if (piece === selectedPiece) {
      setSelected({ row, col });
      setValidMoves(getValidMoves(piece, row, col));
    } else if (selected) {
      if (!validMoves.includes(moveKey)) {
        twin(sfxWrong, voiceWrong);
        return;
      }

      const { row: selRow, col: selCol } = selected;
      const newBoard = board.map((r) => [...r]);

      if (newBoard[row][col] === "pawn") {
        newBoard[row][col] = selectedPiece;
        newBoard[selRow][selCol] = null;
        setBoard(newBoard);
        setSelected(null);
        setValidMoves([]);

        setKickPos({ row, col });
        setFallingPawn({ row, col });
        setImpactEmoji({ row, col }); // 💥

        setTimeout(() => {
          setKicking(true);
          twin(sfxRight, voiceRight);
          confetti();
          setWin(true);

          setTimeout(() => {
            const finalBoard = newBoard.map((r) => [...r]);
            finalBoard[row][col] = selectedPiece;
            setBoard(finalBoard);
            setFallingPawn(null);
            setKickPos(null);
            setImpactEmoji(null);
            setTimeout(() => resetGame(), 1000);
          }, 1000);
        }, 300);
      } else {
        newBoard[row][col] = selectedPiece;
        newBoard[selRow][selCol] = null;
        setBoard(newBoard);
        setSelected(null);
        setValidMoves([]);
      }
    }
  };

  const renderSquare = (row, col) => {
    const piece = board[row][col];
    const moveKey = `${row}-${col}`;
    const isValidMove = validMoves.includes(moveKey);
    const isSelected = selected && selected.row === row && selected.col === col;
    const isKick = kickPos?.row === row && kickPos?.col === col;
    const isFall = fallingPawn?.row === row && fallingPawn?.col === col;
    const isImpact = impactEmoji?.row === row && impactEmoji?.col === col;

    return (
      <div
        key={moveKey}
        className={`square ${isSelected || isValidMove ? "highlight" : ""}`}
        onClick={() => handleSquareClick(row, col)}
      >
        {/* Falling pawn */}
        {isFall && (
          <span className="pawn-fall-slow">{pieceEmojis["pawn"]}</span>
        )}
        {/* Kick impact emoji */}
        {isImpact && <span className="impact-emoji">💥</span>}
        {/* Remaining piece */}
        {piece && (!isFall || piece !== "pawn") && (
          <span className={isKick ? "kicker-punch" : ""}>
            {pieceEmojis[piece]}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="chess-page">
      <button className="back-button" onClick={() => window.history.back()}>
        Back
      </button>

      <h2 className="title">♟️ 4x4 Chess for Suhaas</h2>

      <select
        value={selectedPiece}
        onChange={(e) => setSelectedPiece(e.target.value)}
        className="level-dropdown"
      >
        <option value="rook">Level 1 - Rook</option>
        <option value="bishop">Level 2 - Bishop</option>
        <option value="knight">Level 3 - Knight</option>
        <option value="queen">Level 4 - Queen</option>
      </select>

      {win && <p className="win-text slow">🎉 You Won! 🎉</p>}

      <div className="chess-container">
        <div className="chess-board">
          {board.map((row, rIdx) => (
            <div key={rIdx} className="row">
              {row.map((_, cIdx) => renderSquare(rIdx, cIdx))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
