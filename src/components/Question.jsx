import React from 'react';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';
import * as rightAnswer from '../media/433-checked-done.json';
import { Container, Row, Col, Button } from 'react-bootstrap';

const TIMER = 15;

export default class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // stageState 'q': showing question
      // stageState 'r': right answer selected
      stageState: 'q',
      answers: [],
      timer: TIMER
    }
  }

  animationOptions = {
    loop: false,
    autoplay: true, 
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  componentDidMount() {
    console.debug(this.props.question.correct_answer)
    this.setState({
      answers: shuffle([this.props.question.correct_answer, ...(this.props.question.incorrect_answers)])
    });
    this.interval = setInterval(() => {
      if (this.state.stageState === 'q') {
        if (this.state.timer > 1) {
          this.setState({
            timer: this.state.timer - 1
          });
        } else {
          this.props.endGame('t');
        }
      }
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.question.question !== prevProps.question.question) {
      console.debug(this.props.question.correct_answer)
      this.setState({
        stageState: 'q',
        answers: shuffle([this.props.question.correct_answer, ...(this.props.question.incorrect_answers)]),
        timer: TIMER
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleAnswer = e => {
    const answer = e.target.textContent;
    if (answer === decodeURIComponent(this.props.question.correct_answer)) {
      if(this.props.total === this.props.stage + 1) {
        this.props.endGame('s');
      } else {
        this.setState({
          stageState: 'r'
        });
      }
      this.props.setPoints(this.props.points + 100);
    } else {
      this.props.endGame('w');
    }
  }

  showNextQuestion = () => {
    this.props.showNextQuestion();
  }

  render() {
    if (this.state.stageState === 'r') {
      return (
        <Container>
          <Row xs={4} className="bg-light">
            <Col className="text-center">
              Question {this.props.stage + 1}/{10}
            </Col>
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
              You have earned 100 points<br/>
              Total: {this.props.points} points
            </Col>
          </Row>
          <Row>
            <Col xs={10} className="offset-1 p-2 text-center">
              <Button variant="secondary w-100" onClick={this.showNextQuestion}>Next Question</Button>
            </Col>
          </Row>
        </Container>
      );
    }

    return (
      <Container>
        <Row className="bg-light">
          <Col className="text-center">
            Question {this.props.stage + 1}/{10}
          </Col>
          <Col>{this.props.points} Points</Col>
          <Col>Remaining Time: {this.state.timer}</Col>
        </Row>
        <Row>
          <Col xs={10} className="offset-1 text-center mt-2 mb-5">
            {decodeURIComponent(this.props.question.question)}
          </Col>
        </Row>
        {this.state.answers.map((answer, index) => (
          <Row key={index}>
            <Col xs={10} className="offset-1 p-2 text-center">
              <Button variant="secondary w-100" onClick={this.handleAnswer}>{decodeURIComponent(answer)}</Button>
            </Col>
          </Row>
        ))}
        
      </Container>
    )
  }
}

Question.propTypes = {
  stage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  question: PropTypes.shape({
    question: PropTypes.string,
    correct_answer: PropTypes.string,
    incorrect_answers: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  setPoints: PropTypes.func.isRequired,
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
