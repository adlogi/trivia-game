import React from 'react';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';
import { QUESTIONS_COUNT, TIMER, MAX_POINTS } from '../constants'
import * as rightAnswer from '../media/433-checked-done.json';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // questionState 'q': showing question
      // questionState 'r': showing that right answer selected
      questionState: 'q',
      answers: [],
      timer: TIMER
    }
    this.points = 0;
  }

  animationOptions = {
    loop: false,
    autoplay: true, 
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  componentDidMount() {
    const { question, endGame } = this.props;
    console.debug(question.correct_answer);
    this.setState({
      answers: shuffle([question.correct_answer, ...(question.incorrect_answers)])
    });
    this.interval = setInterval(() => {
      if (this.state.questionState === 'q') {
        if (this.state.timer > 1) {
          this.setState({
            timer: this.state.timer - 1
          });
        } else {
          endGame('t');
        }
      }
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    const { question } = this.props;
    if (question.question !== prevProps.question.question) {
      console.debug(question.correct_answer);
      this.setState({
        questionState: 'q',
        answers: shuffle([question.correct_answer, ...(question.incorrect_answers)]),
        timer: TIMER
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  applyHint = () => {
    const { question, useHint } = this.props;
    const answers = document.querySelectorAll('.answer>div>button');
    let hidden = 0;
    // randomly find two incorrect answers to hide
    while (hidden < 2) {
      const i = Math.floor(Math.random() * 4);
      if (
        answers[i].textContent !== decodeURIComponent(question.correct_answer) &&
        !answers[i].classList.contains('invisible')
      ) {
        answers[i].classList.add('invisible');
        hidden++;
      }
    }
    useHint();
  }

  handleAnswer = e => {
    const { index, question, score, setScore, endGame } = this.props;
    const answer = e.target.textContent;
    if (answer === decodeURIComponent(question.correct_answer)) {
      if(QUESTIONS_COUNT === index + 1) {
        endGame('s');
      } else {
        this.setState({
          questionState: 'r'
        });
      }

      // The time and points range is devided into (5) steps.
      // When 20% of time pass, the player loses 20% of the points.
      const STEPS = 5;
      const timeStep = TIMER / STEPS;
      const pointsStep = MAX_POINTS / STEPS;
      this.points = Math.ceil(this.state.timer / timeStep) * pointsStep;
      setScore(score + this.points);
    } else {
      endGame('w');
    }
  }

  render() {
    const { index, question, hintUsed, score, showNextQuestion } = this.props;

    if (this.state.questionState === 'q') {
      // show a new question
      return (
        <Container>
          <Row className="bg-info">
            <Col className="text-center">Question {index + 1}/{10}</Col>
            <Col className="text-center">{score} Points</Col>
            <Col className="text-center">Remaining Time: {this.state.timer}</Col>
          </Row>
          <Row>
            <Col xs={10} className="offset-1 text-center mt-2 mb-5">
              {decodeURIComponent(question.question)}
            </Col>
          </Row>
          {this.state.answers.map((answer, indx) => (
            <Row key={indx} className="answer">
              <Col xs={10} className="offset-1 p-2 text-center">
                <Button
                  variant="secondary w-100"
                  onClick={this.handleAnswer}
                >
                  {decodeURIComponent(answer)}
                </Button>
              </Col>
            </Row>
          ))}
          {!hintUsed ? (
            <Row className="mt-5">
              <Col xs={10} className="offset-1 p-2 text-center">
                <Button variant="info w-100" onClick={this.applyHint}>50:50 Hint!</Button>
              </Col>
            </Row>
          ) : null}
        </Container>
      )
    } else {
      // if the right answer selected, show new score
      return (
        <Container>
          <Row className="bg-info">
            <Col xs={4} className="text-center">Question {index + 1}/{10}</Col>
          </Row>
          <Row>
            <Col xs={10} className="offset-1 text-center">
              <Lottie
                options={{
                  animationData: rightAnswer.default,
                  ...this.animationOptions
                }}
                width={'60%'}
                isStopped={false}
                isPaused={false}
              />
            </Col>
            <Col xs={10} className="offset-1 text-center">
              Correct!
            </Col>
            <Col xs={10} className="offset-1 text-center">
              You have earned {this.points} points<br/>
              Total: {score} points
            </Col>
          </Row>
          <Row>
            <Col xs={10} className="offset-1 p-2 text-center">
              <Button variant="secondary w-100" onClick={showNextQuestion}>Next Question</Button>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

Question.propTypes = {
  index: PropTypes.number.isRequired,
  question: PropTypes.shape({
    question: PropTypes.string,
    correct_answer: PropTypes.string,
    incorrect_answers: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  hintUsed: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired,
  useHint: PropTypes.func.isRequired,
  setScore: PropTypes.func.isRequired,
  showNextQuestion: PropTypes.func.isRequired,
  endGame: PropTypes.func.isRequired,
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
