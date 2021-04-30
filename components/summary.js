import React, {useState, useEffect} from "react";
import Questions from "../components/questions";
import {Row, Col, Button, Form} from "react-bootstrap";

export default function Summary(props) {
  const [error, setError] = useState(false);
  const [question, setQuestion] = useState(null);
  const [modify, setModify] = useState(false);
  const answer = props.result.answer;
  const confidence = props.result.confidence;
  const comment = props.result.comment;

  function handleClick() {
    setModify(true);
  }

  function handleDone() {
    setModify(false);
  }

  function RenderConfidence() {
    switch (parseInt(confidence)) {
      case 1:
        return "Not at all confident";
      case 2:
        return "Somewhat not confident";
      case 4:
        return "Confident";
      case 5:
        return "Very confident";
    }
  }

  return (
    <div className="mt-3 mb-3 pl-4 pr-4">
      {!modify && (
        <>
          <p
            style={{fontSize: "1.2em"}}
            dangerouslySetInnerHTML={{__html: props.question.question}}
          />

          <div className="mt-1 mb-0">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Your Answer</th>
                  <th scope="col">Degree of Confidence</th>
                  <th scope="col">Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {answer && <td width="25%">Yes</td>}
                  {!answer && <td width="25%">No</td>}
                  {confidence == 1 && <td>Not at all confident</td>}
                  {confidence == 2 && <td>Somewhat not confident</td>}
                  {confidence == 4 && <td>Confident</td>}
                  {confidence == 5 && <td>Very confident</td>}
                  <td width="40%">{comment}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-5">
            <Button
              className="actionButton"
              style={{width: "25%"}}
              variant="primary"
              onClick={(e) => handleClick()}
            >
              Modify Response
            </Button>
          </div>
        </>
      )}
      {modify && (
        <>
          <Questions
            data={props.question}
            counter={props.index + 1}
            total={props.total}
            onAnswer={props.handleAnswer}
            mode={true}
            result={props.result}
          />
          <div className="mb-5">
            <Button
              className="actionButton"
              style={{width: "25%"}}
              variant="primary"
              onClick={(e) => handleDone()}
            >
              Done
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
