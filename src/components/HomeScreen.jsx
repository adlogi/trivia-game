import React from 'react'
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';
import * as logo from '../media/11053-faq.json';
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';

// Categories from OpenTriviaDB
// https://opentdb.com/api_config.php
const categories = {
  '9': 'General Knowledge',
  '17': 'Science & Nature',
  '18': 'Computers',
  '23': 'History'
}

const animationOptions = {
  loop: true,
  autoplay: true, 
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export default function HomeScreen({category, onChangeCategory, level, onChangeLevel, onStartClick}) {
  return (
    <Container>
      <Row>
        <Col className="mt-5 text-center">
          <Lottie
            options={{
              animationData: logo.default,
              ...animationOptions
            }}
            width={'80%'}
            isStopped={false}
            isPaused={false}
          />
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <h1>A Trivia Game</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={10} className="offset-1 my-5 text-center">
          <Button variant="secondary w-100" onClick={onStartClick}>GET STARTED</Button>
        </Col>
      </Row>
      <Row>
        <Col xs={10} className="offset-1 my-2 text-center">
          <DropdownButton title={categories[category]} variant="secondary w-100">
            {Object.keys(categories).map(key => 
              <Dropdown.Item key={key} onClick={() => onChangeCategory(key)} className="w-100">{categories[key]}</Dropdown.Item>
            )}
          </DropdownButton>
        </Col>
      </Row>
      <Row>
        <Col xs={10} className="offset-1 my-2 text-center">
          <DropdownButton title={capitalizeFirst(level)} variant="secondary w-100">
            <Dropdown.Item onClick={() => onChangeLevel('easy')} className="w-100">Easy</Dropdown.Item>
            <Dropdown.Item onClick={() => onChangeLevel('medium')} className="w-100">Medium</Dropdown.Item>
            <Dropdown.Item onClick={() => onChangeLevel('hard')} className="w-100">Hard</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
    </Container>
  )
}

HomeScreen.propTypes = {
  category: PropTypes.string.isRequired,
  onChangeCategory: PropTypes.func.isRequired,
  level: PropTypes.string.isRequired,
  onChangeLevel: PropTypes.func.isRequired,
  onStartClick: PropTypes.func.isRequired
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}