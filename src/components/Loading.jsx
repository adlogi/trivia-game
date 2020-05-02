import React from 'react';
import Lottie from 'react-lottie';
import * as spinner from '../media/15304-spinner.json';
import { Container, Row, Col } from 'react-bootstrap';

const animationOptions = {
  loop: true,
  autoplay: true, 
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export default function Loading() {
  return (
    <Container className="h-100 d-flex">
      <Row className="my-auto">
        <Col xs={12} className="text-center">
          <Lottie
            options={{
              animationData: spinner.default,
              ...animationOptions
            }}
            width={'80%'}
            isStopped={false}
            isPaused={false}
          />
        </Col>
        <Col xs={12} className="text-center">Loading...</Col>
      </Row>
    </Container>
  );
}
