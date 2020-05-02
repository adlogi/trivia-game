import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import Loading from './components/Loading';
import Question from './components/Question';
import Result from './components/Result';
import { QUESTIONS_COUNT } from './constants'
import './App.css';

function App() {
  // screen 'i': intro
  // screen 'f': fetching data
  // screen 'p': still playing
  // screen 's': success
  // screen 'w': wrong answer
  // screen 't': time's up!
  const [screen, setScreen] = useState('i');
  // Difficulty level of the quiz
  const [level, setLevel] = useState('easy');
  // Quiz questions category
  const [category, setCategory] = useState('9');
  // quiz questions/answers as retrieved from triviaDB
  const [quiz, setQuiz] = useState(null);
  // questionIndex: 0 ... <QUESTIONS_COUNT> - 1
  const [questionIndex, setQuestionIndex] = useState(0);
  // Total score
  const [score, setScore] = useState(0);
  // Has hint been used (available only once)
  const [hintUsed, setHintUsed] = useState(false);

  // Show home screen again to start a new quiz
  const restart = () => {
    setScreen('i');
    setQuiz(null);
    setQuestionIndex(0);
    setScore(0);
    setHintUsed(false);
  }

  const handleStartClick = () => {
    setScreen('f');
    fetchQuiz(level, category);
  }

  const fetchQuiz = (difficulty = 'easy', category = '9') => {
    // example: https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple&encode=url3986
    const url = `https://opentdb.com/api.php?amount=${QUESTIONS_COUNT}&category=${category}&difficulty=${difficulty}&type=multiple&encode=url3986`;
    console.debug(url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setQuiz(data.results);
        setQuestionIndex(0);
        setScreen('p');
      });
  }

  switch (screen) {
    // fetching quiz
    case 'f':
      return (<Loading />);
    // playing, showing questions
    case 'p':
      return (
        <Question
          index={questionIndex}
          question={quiz[questionIndex]}
          hintUsed={hintUsed}
          score={score}
          useHint={() => setHintUsed(true)}
          setScore={setScore}
          showNextQuestion={() => setQuestionIndex(questionIndex + 1)}
          endGame={setScreen}
        />
      );
    case 's':   // game ends: success
    case 'w':   // game ends: wrong answer
    case 't':   // game ends: time's up
      return (
        <Result outcome={screen} score={score} onRestart={restart}></Result>
      );
    // game intro
    case 'i':
    default:
      return (
        <HomeScreen
          category={category}
          onChangeCategory={setCategory}
          level={level}
          onChangeLevel={setLevel}
          onStartClick={handleStartClick}
        />
      );
  }
}

export default App;
