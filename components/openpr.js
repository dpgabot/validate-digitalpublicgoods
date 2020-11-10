import {Jumbotron, Row, Col, Button} from 'react-bootstrap';
import { Octokit } from "@octokit/core";
import { useSession } from 'next-auth/client'


export default function Questions (props) {

	const [ session, loading ] = useSession()

	async function handleClick(){
		console.log(props.answer)
		console.log(session)
		console.log( process.env.NEXT_PUBLIC_GITHUB_OWNER)

		const octokit = new Octokit({ auth: session.accessToken }),
		owner = process.env.NEXT_PUBLIC_GITHUB_OWNER,
		repo = process.env.NEXT_PUBLIC_GITHUB_REPO,
        title = 'My Test Pull Request',
        body  = 'This pull request is a test!',
        head  = 'my-feature-branch',
        base  = 'master';

		const response = await octokit.request(
		    `POST /repos/{owner}/{repo}/pulls`, { owner, repo, title, body, head, base }
		);

	}



	return (
		<div className="text-center"> 

			<h2>You are almost done!</h2>

			<p>When you are ready to submit, click the button:</p>

			<Button className='actionButton' style={{width: '80px'}} variant="primary" onClick={e => handleClick()}>Submit</Button>
				
		</div>
	)
}