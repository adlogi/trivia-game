import React from 'react'
import { Container, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import logo from '../logo.svg';

const categories = {
  9: 'General Knowledge',
  17: 'Science & Nature',
  18: 'Computers',
  23: 'History'
}
export default function HomePage({category, onChangeCategory, level, onChangeLevel, onStartClick}) {
  return (
    <Container>
      <Row>
        <Col className="mt-5 text-center">
          <img src={logo} className="App-logo" alt="logo" />
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          A Trivia Game
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

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}