import React, {useState, useEffect} from "react";
import Questions from "../components/questions";
import {Row, Col, Button, Form} from "react-bootstrap";

export default function Summary(props) {
  const [modify, setModify] = useState(false);
  const [result, setResult] = useState(props.result);

  function handleClick() {
    setModify(true);
  }

  function handleModification(modifiedAns) {
    setResult(modifiedAns);
    props.onSummaryModify(modifiedAns, props.index);
    setModify(false);
  }

  return (
    <div className="mt-3 mb-3 pl-4 pr-4">
      {!modify && (
        <>
          <p style={{fontSize: "1.2em"}}>
            [{props.index + 1}/{props.total}]
          </p>
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
                  {result.answer && <td width="25%">Yes</td>}
                  {!result.answer && <td width="25%">No</td>}
                  {result.confidence == 1 && <td>Not at all confident</td>}
                  {result.confidence == 2 && <td>Somewhat not confident</td>}
                  {result.confidence == 4 && <td>Confident</td>}
                  {result.confidence == 5 && <td>Very confident</td>}
                  <td width="40%">{result.comment}</td>
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
            onModify={handleModification}
            mode={true}
            result={result}
          />
        </>
      )}
    </div>
  );
}
