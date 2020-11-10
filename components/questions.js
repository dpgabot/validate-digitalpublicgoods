import React, { useState, useEffect } from 'react'
import {Row, Col, Button} from 'react-bootstrap';

export default function Questions (props) {

	const [result, setResult] = useState(null);

	function handleClick(e, value) {
		setResult({answer: value})
		props.onAnswer({answer: value});
	}

	return (
		<div> 

			<h2>Indicator 2: License</h2>
			<p style={{fontSize: '1.2em'}}>
				The project owner claims that <span className='emphasis'>{props.data.name}</span> is licensed under a&nbsp;
				<span className='emphasis'>{props.data.license.spdx} license</span> and provided&nbsp;
				<a href="{props.data.license.licenseURL}}" target="_blank" className='emphasis'>this link</a> to the license.
			</p>

			<h2>Question</h2>
			<p style={{fontSize: '1.2em'}}>
				Does <a href="{props.data.license.licenseURL}}" target="_blank" className='emphasis'>this link</a> point to a <span className='emphasis'>{props.data.license.spdx} license</span>?
			</p>



			<Row className="pt-5">
				<Col xs={{span:4, offset:2}} className="text-center">
					<Button className='actionButton' style={{width: '80px'}} variant="success" onClick={e => handleClick(e, 'yes')}>Yes</Button>
				</Col>
				<Col xs={4} className="text-center">
					<Button className='actionButton' style={{width: '80px'}} variant="danger" onClick={e => handleClick(e, 'no')}>No</Button>
				</Col>
			</Row>


		</div>
	)
}