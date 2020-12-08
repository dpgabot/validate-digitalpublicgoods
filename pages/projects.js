import React, { useState, useEffect } from 'react'
import { signIn, signOut, useSession, providers } from 'next-auth/client'
import { useRouter } from 'next/router'
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

export default function Projects () {

	const router = useRouter()
	const [ session, loading ] = useSession();
	const [ submissions, setSubmissions] = useState(null);
	const [ currentReview, setCurrentReview] = useState(null);

	/**
	 * Shuffles array in place. ES6 version
	 * @param {Array} a items An array containing the items.
	 */
	function shuffle(a) {
	    for (let i = a.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [a[i], a[j]] = [a[j], a[i]];
	    }
	    return a;
	}

	useEffect(() => {

		if(!loading && !session){
			router.push('/')
		}
	}, [session, loading]);

	function handleClick(submission){
		setCurrentReview(submission)
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
			setSubmissions(shuffle(array));
		}
		fetchData();
	}, []);

	if(!session) {
		return(
			<Container fluid="true">
				<div fluid="true" className="text-center mt-5 pt-5">
					<Spinner animation="border" role="status" className="mt-5 mb-5">
		  				<span className="sr-only">Loading...</span>
					</Spinner>
				</div>
			</Container>
		)
	} else {

		if(currentReview){
			return (
				<Review
					submission={currentReview}
				/>
			)
		}else{
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

