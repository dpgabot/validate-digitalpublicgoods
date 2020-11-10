import React, { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import Layout from '../components/layout'
import Questions from '../components/questions'
import OpenPR from '../components/openpr'

export default function Page () {
	const [ session, loading ] = useSession()

	const [counter, setCounter] = useState(0);
	const [question, setQuestion] = useState({ name:'OpenCRVS', license: {spdx: 'MPL-2.0', licenseURL: 'https://www.opencrvs.org/license'}});
	const [questions, setQuestions] = useState([question]);
	const [result, setResult] = useState(null);


	function handleAnswer(answer) {

		setResult(answer)

		if (counter < questions.length) {
			setCounter(counter + 1);
	  	} 
	}

	return (
		<Layout>

			<h1 style={{textAlign: 'center', padding: '1em 0'}}>Validate Digital Public Goods</h1>

			{!session &&
				<div className="text-center">
					You need to log in first
				</div>
			}
			{session && <>
				{(counter < questions.length) &&
				<Questions
			  		data = {question}
			  		onAnswer={handleAnswer}
			  	/>}
			  	{!(counter < questions.length) &&
			  		<OpenPR 
			  			answer={result}/>
			  	}
			</>}
		</Layout>
	)
}