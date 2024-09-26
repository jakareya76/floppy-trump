import { useEffect, useState } from "react";
import trump from "./assets/img.png"; // Image of Donald Trump
import explosion from "./assets/explosion.png"; // Image of Explosion

const App = () => {
  const [birdPosition, setBirdPosition] = useState(300); // Bird's Y position
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [pipeHeight, setPipeHeight] = useState(200); // Height of the first pipe
  const [pipeLeft, setPipeLeft] = useState(500); // Pipe's X position
  const [score, setScore] = useState(0); // Game score
  const [isGameOver, setIsGameOver] = useState(false);
  const [explosionPosition, setExplosionPosition] = useState({}); // Position of the explosion

  const birdSize = 60; // Size of the bird (image)
  const gravity = 6;
  const jumpHeight = 70;
  const pipeWidth = 60;
  const pipeGap = 200; // Increased gap between pipes

  const gameHeight = 600;
  const gameWidth = 400;

  // Start the game and handle bird movement (gravity)
  useEffect(() => {
    let timeId;
    if (gameHasStarted && !isGameOver && birdPosition < gameHeight - birdSize) {
      timeId = setInterval(() => {
        setBirdPosition((pos) => pos + gravity);
      }, 24);
    }
    return () => clearInterval(timeId);
  }, [birdPosition, gameHasStarted, isGameOver]);

  // Handle pipe movement and collision detection
  useEffect(() => {
    let pipeId;
    if (gameHasStarted && !isGameOver && pipeLeft >= -pipeWidth) {
      pipeId = setInterval(() => {
        setPipeLeft((pos) => pos - 5);
      }, 24);
      return () => clearInterval(pipeId);
    } else if (pipeLeft < -pipeWidth) {
      setPipeLeft(gameWidth); // Reset pipe position
      setPipeHeight(Math.floor(Math.random() * (gameHeight - pipeGap)));
      setScore((prevScore) => prevScore + 1); // Increase score
    }
  }, [pipeLeft, gameHasStarted, isGameOver]);

  // Collision detection
  useEffect(() => {
    const topPipe = pipeHeight;
    const bottomPipe = pipeHeight + pipeGap;

    // Adjust collision detection to include the bird size
    if (
      (birdPosition < topPipe || birdPosition + birdSize > bottomPipe) &&
      pipeLeft >= 0 &&
      pipeLeft <= pipeWidth
    ) {
      setIsGameOver(true); // Stop the game
      setGameHasStarted(false); // Set game has started to false
      // Set explosion position immediately where the collision occurred
      setExplosionPosition({ top: birdPosition, left: pipeLeft - 20 });
    }
  }, [birdPosition, pipeHeight, pipeLeft]);

  // Add event listener for Spacebar for desktop
  useEffect(() => {
    const handleSpacebar = (e) => {
      if (e.code === "Space") {
        handleJump();
      }
    };

    window.addEventListener("keydown", handleSpacebar);

    return () => {
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, [birdPosition, gameHasStarted]);

  // Restart the game
  const handleRestart = () => {
    setBirdPosition(300);
    setPipeHeight(200);
    setPipeLeft(500);
    setScore(0);
    setIsGameOver(false);
    setGameHasStarted(false);
    setExplosionPosition({}); // Reset explosion position
  };

  // Handle the bird jump (Spacebar or click/tap)
  const handleJump = () => {
    if (!gameHasStarted) {
      setGameHasStarted(true);
    }
    const newBirdPosition = birdPosition - jumpHeight;
    if (newBirdPosition >= 0) {
      setBirdPosition(newBirdPosition);
    } else {
      setBirdPosition(0);
    }
  };

  return (
    <div
      className="relative mx-auto bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center h-screen w-screen"
      onClick={handleJump} // Handles mobile touch input
    >
      {/* Game Container */}
      <div
        className="relative bg-gray-700 overflow-hidden rounded-lg shadow-lg"
        style={{ height: gameHeight, width: gameWidth }}
      >
        {/* Bird (Image of Donald Trump) */}
        {!isGameOver ? (
          <img
            src={trump} // Image of Donald Trump
            alt="Donald Trump Face"
            className="absolute"
            style={{
              width: birdSize,
              height: birdSize,
              top: birdPosition,
              left: 100,
            }}
          />
        ) : (
          // Explosion Image
          <img
            src={explosion} // Image of Explosion
            alt="Explosion"
            className="absolute"
            style={{
              width: 80, // Adjust size as needed
              height: 80, // Adjust size as needed
              top: explosionPosition.top, // Position based on explosion state
              left: explosionPosition.left, // Position based on explosion state
            }}
          />
        )}

        {/* Pipe (top) */}
        <div
          className="absolute bg-green-600 rounded-b-lg shadow-lg"
          style={{
            width: pipeWidth,
            height: pipeHeight,
            top: 0,
            left: pipeLeft,
          }}
        ></div>

        {/* Pipe (bottom) */}
        <div
          className="absolute bg-green-600 rounded-t-lg shadow-lg"
          style={{
            width: pipeWidth,
            height: gameHeight - pipeHeight - pipeGap,
            top: pipeHeight + pipeGap,
            left: pipeLeft,
          }}
        ></div>

        {/* Score */}
        <div className="absolute text-3xl text-white top-2 left-2">
          Score: {score}
        </div>

        {/* Game Over Message */}
        {isGameOver && (
          <div className="absolute text-center text-white w-full top-1/3">
            <h1 className="text-4xl font-bold">Game Over</h1>
            <button
              onClick={handleRestart}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
