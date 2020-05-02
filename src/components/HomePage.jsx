import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import logo from '../logo.svg';

export default function HomePage({onStartClick}) {
  return (
    <Container fluid>
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
    </Container>
  )
}
