import React, { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import {Button, CardColumns, Card, Container, Spinner} from 'react-bootstrap'
import Layout from '../components/layout'
import Questions from '../components/questions'
import OpenPR from '../components/openpr'
import Review from './review'

const OWNER = 'unicef';
const REPO = 'publicgoods-candidates';
const BRANCH = 'master'
const GITHUBAPI = `https://api.github.com/repos/${OWNER}/${REPO}/`;
const GITHUBRAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/`;

export default function Page () {

	const [ session, loading ] = useSession()
	const [submissions, setSubmissions] = useState(null);
	const [currentReview, setCurrentReview] = useState(null);

	function handleClick(submission){
		setCurrentReview(submission)
		console.log('handleClick')
	}

	useEffect(() => {
		async function fetchData() {
			let array = []
			const result = await fetch(`${GITHUBAPI}contents/screening`);
			const items =  await result.json();
			for(let i=0; i < items.length; i++) {
				if(items[i].size > 50) {
					const response1 = await fetch(GITHUBRAW+items[i].path);
					const submission = await response1.json();
					const response2 = await fetch(GITHUBRAW+'nominees/'+items[i].name);
					const nominee = await response2.json()
					array.push(Object.assign({}, nominee, submission))
				}
			}
			setSubmissions(array);
		}
		fetchData();
	}, []);

	if(!session) {
		return(
			<>
				<h1 style={{textAlign: 'center', padding: '1em 0'}}>Validate Digital Public Goods</h1>
				<p>Lorem ipsum dolor sit amet, <b>crowdsourcing tool</b> consectetur adipiscing elit. Aenean dapibus ultrices rhoncus. Integer imperdiet felis et lectus rhoncus, non iaculis <b>it is amazing, really</b> augue dignissim. Sed sit amet neque vel <b>you can contribute</b> nisi quis varius. Aenean a vestibulum nibh, eu varius sapien. Nunc convallis euismod ipsum non tincidunt. Aliquam erat volutpat. Proin et felis vel <b>validate digital public good submissions</b> ex pellentesque posuere sed at ligula. Morbi sodales, magna luctus consectetur cursus, libero nulla pulvinar leo, sed pellentesque elit ipsum sit amet massa, <b>amazing way to contribute</b>.</p>
				<p>In order to use this online validation tool, you need to sign in through GitHub by clicking on the button below. This web application will use your credentials to submit your review at the end by opening a pull request to our repository on your behalf. For this reason, the application will request the authentication <code>public_repo</code> scope. Refer to GitHub's documentation <a href="https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/" target="_blank">Understanding scopes for OAuth Apps</a> for additional information about this setting. This application is open source, and you can review the <a href="https://github.com/lacabra/validate-digitalpublicgoods" target="_blank">source code</a> at anytime.</p>
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
		)
	} else {
		if(currentReview){
			return (
				<Review
					submission={currentReview}
				/>
			)
		}else{
			console.log(submissions)
			return (
				<Layout>
					<p className="mt-5 mb-2">Please choose one of the projects below to review:</p>
					{ submissions &&
						<CardColumns>
						  	{submissions.map( s => (
						  		<Card key={s.name}>
								    <Card.Body>
								    	<Card.Title className="text-center">{s.name}</Card.Title>
								    	<Card.Text>{s.description}</Card.Text>
								    </Card.Body>
								    <Container className="text-center mb-3">
								    	<Button variant="primary" onClick={e => handleClick(s)}>Review</Button>
								    </Container>
							  	</Card>
							))}
						</CardColumns>
					}
					{ !submissions &&
						<CardColumns>
						  	{[1,2,3].map( s => (
						  		<Card key={s}>
								    <Card.Body className="text-center">
								    	
								    		<Spinner animation="border" role="status" className="mt-5 mb-5">
								  				<span className="sr-only">Loading...</span>
											</Spinner>
								    </Card.Body>
								    <Container className="text-center mb-1">
								    	<p>&nbsp;</p>
								    </Container>
							  	</Card>
							))}
						</CardColumns>
					}	
				</Layout>
			)
		}
	}
}