import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import Loading from './components/Loading';
import Question from './components/Question';
import Result from './components/Result';
import './App.css';

const QUESTIONS_COUNT = 10;

function App() {
  // questionIndex: 0 ... <QUESTIONS_COUNT> - 1
  const [questionIndex, setQuestionIndex] = useState(0);
  // screen 'i': intro
  // screen 'f': fetching data
  // screen 'p': still playing
  // screen 's': success
  // screen 'w': wrong answer
  // screen 't': time's up!
  const [screen, setScreen] = useState('i');
  // quiz questions/answers as retrieved from triviaDB
  const [quiz, setQuiz] = useState(null);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState('easy');
  const [category, setCategory] = useState('9');

  const restart = () => {
    setScreen('i');
    setQuiz(null);
    setQuestionIndex(0);
    setPoints(0);
  }

  const handleStartClick = () => {
    setScreen('f');
    fetchQuiz(level, category);
  }

  const fetchQuiz = (difficulty = 'easy', category = '9') => {
    // example: https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple&encode=url3986
    const url = `https://opentdb.com/api.php?amount=${QUESTIONS_COUNT}&category=${category}&difficulty=${difficulty}&type=multiple&encode=url3986`;
    console.log(url)
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setQuiz(data.results);
        setScreen('p');
        setQuestionIndex(0);
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
          stage={questionIndex}
          total={QUESTIONS_COUNT}
          question={quiz[questionIndex]}
          points={points}
          setPoints={setPoints}
          showNextQuestion={() => setQuestionIndex(questionIndex + 1)}
          endGame={setScreen}
        />
      );
    
    case 's':   // game ends: success
    case 'w':   // game ends: wrong answer
    case 't':   // game ends: time's up
      return (
        <Result outcome={screen} points={points} onRestart={restart}></Result>
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
