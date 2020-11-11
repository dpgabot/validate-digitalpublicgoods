import React, { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import {Button} from 'react-bootstrap'
import Layout from '../components/layout'
import Questions from '../components/questions'
import OpenPR from '../components/openpr'

const qs = [
	{
		item: 'license',
		text: 'The project owner claims that OpenCRVS is licensed under a <span class="emphasis">Mozilla Public License 2.0</span> and provided <a href="https://www.opencrvs.org/license" target="_blank" class="emphasis">this link</a> to the license.',
		question: 'Does <a href="https://www.opencrvs.org/license" target="_blank" class="emphasis">this link</a> point to a <span class="emphasis">Mozilla Public License 2.0</span>?'
	},
	{
		item: 'SDG[0]',
		text: 'The project owner claims that OpenCRVS is relevant to <span class="emphasis">SDG 16: Peace, Justice and Strong Institutions</span>, and provided both this text: <blockquote>OpenCRVS is a digital public good to help achieve universal civil registration and evidence-based decision making in all country contexts.\nOpenCRVS was created in direct response to: \nSDG Goal/Target 16.9: \"By 2030, provide legal identity for all, including birth registration\"\nIndicator: Proportion of children under 5 years whose births have been registered with a civil authority, by age.\n In addition (as of March 2017), 67 of the 230 SDG indicators can be measured effectively by using data derived from well-functioning CRVS systems, in particular for the numerators (births, deaths) and denominators (total population, live births, total deaths). These indicators cover 12 of the SDG 17 goals (Goals 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 16, and 17).</blockquote> and the following link: <a href="https://documentation.opencrvs.org/opencrvs-core/">https://documentation.opencrvs.org/opencrvs-core/</a>',
		question: 'Does the evidence provided justify their relevance to <span class="emphasis">SDG 16</span>?'
	},
	{
		item: 'SDG[1]',
		text: 'The project owner claims that OpenCRVS is relevant to <span class="emphasis">SDG 17: Partnership for the Goals</span>, and provided both this text: <blockquote>OpenCRVS is a digital public good to help achieve universal civil registration and evidence-based decision making in all country contexts.\nOpenCRVS was created in direct response to: \nSDG Goal/Target 17.18: \"By 2020? increase significantly the availability of high-quality, timely and reliable data disaggregated by income, gender, age, race, ethnicity, migratory status, disability, geographic location and other characteristics relevant in national contexts\"\nIndicator 1: Proportion of sustainable development indicators produced at the national level with full disaggregation when relevant to the target, in accordance with the Fundamental Principles of Official Statistics\nSDG Goal/Target 17.19: \"By 2030? support statistical capacity building in countries\"\nIndicator 2: Proportion of countries that have conducted at least one population and housing census in the last 10 years and have achieved 100 percent birth registration and 80 percent death registration.\nIn addition (as of March 2017), 67 of the 230 SDG indicators can be measured effectively by using data derived from well-functioning CRVS systems, in particular for the numerators (births, deaths) and denominators (total population, live births, total deaths). These indicators cover 12 of the SDG 17 goals (Goals 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 16, and 17).</blockquote> and the following link: <a href="https://documentation.opencrvs.org/opencrvs-core/">https://documentation.opencrvs.org/opencrvs-core/</a>',
		question: 'Does the evidence provided justify their relevance to <span class="emphasis">SDG 17</span>?'
	}
]


export default function Page () {
	const [ session, loading ] = useSession()

	const [counter, setCounter] = useState(0);
	const [question, setQuestion] = useState(qs[0]);
	const [questions, setQuestions] = useState(qs);
	const [result, setResult] = useState({});


	function handleAnswer(answer) {

		result[question.item] = answer;

		setResult(result)

		if (counter < questions.length) {
			setQuestion(questions[counter+1]);
			setCounter(counter + 1);
		} 
		console.log(result)

	}

	return (
		<Layout progress={counter/questions.length*100}>
			{!session &&
				<>
					<h1 style={{textAlign: 'center', padding: '1em 0'}}>Validate Digital Public Goods</h1>

					<p>Lorem ipsum dolor sit amet, <b>crowdsourcing tool</b> consectetur adipiscing elit. Aenean dapibus ultrices rhoncus. Integer imperdiet felis et lectus rhoncus, non iaculis <b>it is amazing, really</b> augue dignissim. Sed sit amet neque vel <b>you can contribute</b> nisi quis varius. Aenean a vestibulum nibh, eu varius sapien. Nunc convallis euismod ipsum non tincidunt. Aliquam erat volutpat. Proin et felis vel <b>validate digital public good submissions</b> ex pellentesque posuere sed at ligula. Morbi sodales, magna luctus consectetur cursus, libero nulla pulvinar leo, sed pellentesque elit ipsum sit amet massa. <b>amazing way to contribute</b>. Nulla sapien dui, posuere nec enim nec, faucibus condimentum sem. Donec vitae dignissim libero, nec rhoncus ante. Vivamus sed mi orci. <b>sustainable development goals</b>.</p>
					<p>Cras scelerisque viverra nibh eu lacinia. <b>a number of questions</b> donec tempor aliquam ante condimentum ultrices. Nulla lacinia eros a tellus pulvinar, quis porta <b>validate information</b> elit lectus, eget mollis enim blandit nec. Donec pellentesque turpis lectus, id facilisis ipsum venenatis id. Maecenas non nisl vulputate felis fringilla scelerisque eget nec leo <b>and submit your review</b>. Curabitur id nulla ac quam dignissim efficitur.</p>
					<div className="text-center">
						<Button
						href={`/api/auth/signin`}
						className='actionButton'
						style={{width: '80px'}}
						variant="primary"
						onClick={(e) => {
							e.preventDefault()
							 signIn()
						}}>
							Sign in
						</Button>
					</div>
				</>
			}
			{session && <>
				{(counter < questions.length) &&
				<Questions
					data = {question}
					counter = {counter+1}
					onAnswer = {handleAnswer}
				/>}
				{!(counter < questions.length) &&
					<OpenPR
						answer={result}/>
				}
			</>}
		</Layout>
	)
}