import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Question from './components/Question';
import Result from './components/Result';
import './App.css';

const QUESTIONS_COUNT = 10;

function App() {
  
  // stage -1: Intro screen
  // stage 0 ... <QUESTIONS_COUNT> - 1: Question screen
  const [stage, setStage] = useState(-1);
  // result 'p': still playing
  // result 's': success
  // result 'w': wrong answer
  // result 't': time's up!
  const [result, setResult] = useState('p');
  // quiz questions/answers as retrieved from triviaDB
  const [quiz, setQuiz] = useState(null);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState('easy');
  const [category, setCategory] = useState(9);

  const fetchQuiz = (difficulty = 'easy', category = 9) => {
    // example: https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple
    const url = `https://opentdb.com/api.php?amount=${QUESTIONS_COUNT}&category=${category}&difficulty=${difficulty}&type=multiple`;
    console.log(url)
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setQuiz(data.results);
        setStage(0);
      });
  }

  const restart = () => {
    setStage(-1);
    setResult('p');
    setQuiz(null);
    setPoints(0);
  }

  const handleStartClick = () => {
    fetchQuiz(level, category);
  }

  if (stage === -1)
    return (
      <HomePage
        category={category}
        onChangeCategory={setCategory}
        level={level}
        onChangeLevel={setLevel}
        onStartClick={handleStartClick}
      />
    );

  if (result === 'p' && stage < QUESTIONS_COUNT) {
    return (
      <Question
        stage={stage}
        total={QUESTIONS_COUNT}
        question={quiz[stage]}
        points={points}
        setPoints={setPoints}
        showNextQuestion={() => setStage(stage + 1)}
        endGame={setResult}
      />
    );
  }
  
  return <Result outcome={result} points={points} onRestart={restart}></Result>
}

export default App;
