import React, { useState, useEffect } from 'react'
import {Row, Col, Button} from 'react-bootstrap';

export default function Questions (props) {

	const [result, setResult] = useState(null);

	function handleClick(e, value) {
		setResult({answer: value})
		props.onAnswer({answer: value});
	}

	return (
		<div className='mt-5 mb-5'>
			<h2>[{props.counter}/{props.total}] Is this statement accurate?</h2>
			<p style={{fontSize: '1.2em'}} dangerouslySetInnerHTML={{__html: props.data.text.replace(/(?:\r\n|\r|\n)/g, '<br>')}} />

			<h2>Your assessment:</h2>
			<p style={{fontSize: '1.2em'}} dangerouslySetInnerHTML={{__html: props.data.question}} />

			<Row className="pt-5">
				<Col xs={{span:4, offset:2}} className="text-center">
					<Button className='actionButton' style={{width: '80px'}} variant="success" onClick={e => handleClick(e, true)}>Yes</Button>
				</Col>
				<Col xs={4} className="text-center">
					<Button className='actionButton' style={{width: '80px'}} variant="danger" onClick={e => handleClick(e, false)}>No</Button>
				</Col>
			</Row>
		</div>
	)
}