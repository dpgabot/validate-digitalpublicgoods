import React, {useState, useEffect} from "react";
import {Row, Col, Button, Form} from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

const DEFAULT_CONFIDENCE = 3;
const DEFAULT_RESULT = {answer: null, comment: "", confidence: DEFAULT_CONFIDENCE};

export default function Questions(props) {
  const [prev, setPrev] = useState(false);
  const [next, setNext] = useState(false);
  const [result, setResult] = useState(DEFAULT_RESULT);
  const [answer, setAnswer] = useState(null);
  const [confidence, setConfidence] = useState(DEFAULT_CONFIDENCE);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // Only enable Previous button past the first question
    if (props.counter > 1) {
      setPrev(true);
    } else {
      setPrev(false);
    }
    // If the result is already set for this answer, update it accordingly
    if (props.result) {
      setResult(props.result);
      setAnswer(props.result.answer);
      if (props.result.confidence != "") {
        setConfidence(props.result.confidence);
      } else {
        setConfidence(DEFAULT_CONFIDENCE);
      }
      if (props.result.comment) {
        setComment(props.result.comment);
      } else {
        setComment("");
      }
      // If this question has been answered, enable next button
      if (props.result.answer === false || props.result.answer === true) {
        setNext(true);
      }
    }
  }, [props.result, props.counter]); // useEffect anytime we receive a new props.result

  function handleClick(next) {
    if (next && confidence === DEFAULT_CONFIDENCE) {
      setError(true);
    } else {
      let result = {answer: answer, comment: comment, confidence: confidence};
      props.onAnswer(result, next);
      setConfidence(DEFAULT_CONFIDENCE);
      setComment("");
      setAnswer(null);
      setNext(false);
      setError(false);
      setResult(DEFAULT_RESULT);
    }
  }

  function sliderLabel(value) {
    let label;
    switch (parseInt(value)) {
      case 1:
        label = "Not at all confident";
        break;
      case 2:
        label = "Somewhat not confident";
        break;
      case 3:
        label = "<< choose >>";
        break;
      case 4:
        label = "Confident";
        break;
      case 5:
        label = "Very confident";
        break;
    }
    return label;
  }

  return (
    <div className="mt-1 mb-5">
      <h2>
        [{props.counter}/{props.total}] Is this statement accurate?
      </h2>
      <p
        style={{fontSize: "1.2em"}}
        dangerouslySetInnerHTML={{
          __html: props.data.text.replace(/(?:\r\n|\r|\n)/g, "<br>"),
        }}
      />

      <h2>Your assessment:</h2>
      <p
        style={{fontSize: "1.2em"}}
        dangerouslySetInnerHTML={{__html: props.data.question}}
      />

      <Row className="pt-2">
        <Col xs={{span: 4, offset: 2}} className="text-center">
          <Button
            className={answer === true ? "actionButton selectedButton" : "actionButton"}
            style={{width: "80px"}}
            variant="success"
            onClick={(e) => {
              setAnswer(true), setNext(true);
            }}
          >
            Yes
          </Button>
        </Col>
        <Col xs={4} className="text-center">
          <Button
            className={answer === false ? "actionButton selectedButton" : "actionButton"}
            style={{width: "80px"}}
            variant="danger"
            onClick={(e) => {
              setAnswer(false), setNext(true);
            }}
          >
            No
          </Button>
        </Col>
      </Row>
      <p>&nbsp;</p>
      <p>What&apos;s you degree of confidence in your answer?</p>
      <RangeSlider
        value={confidence}
        min={1}
        max={5}
        step={1}
        onChange={(changeEvent) => setConfidence(changeEvent.target.value)}
        tooltipLabel={(value) => sliderLabel(value)}
      />
      <div className={error ? "alert-danger p-1" : "d-none"}>
        Please choose a value for your degree of confidence.
      </div>

      <Form.Group controlId="exampleForm.ControlTextarea1" className="pt-3">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Optional: add any comments to support your answer"
          value={comment}
          onChange={(changeEvent) => setComment(changeEvent.target.value)}
        />
      </Form.Group>

      <Row className="pt-3">
        <Col xs={{span: 6, offset: 0}} md={{span: 4, offset: 2}} className="text-center">
          <Button
            className="actionButton"
            style={{width: "100%"}}
            variant="secondary"
            onClick={(e) => handleClick(false)}
            disabled={!prev}
          >
            &lt;&lt; Previous
          </Button>
        </Col>
        <Col xs={6} md={4} className="text-center">
          <Button
            className="actionButton"
            style={{width: "100%"}}
            variant="secondary"
            onClick={(e) => handleClick(true)}
            disabled={!next}
          >
            Next &gt;&gt;
          </Button>
        </Col>
      </Row>
    </div>
  );
}
