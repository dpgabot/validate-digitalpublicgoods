import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signIn, useSession, getSession } from 'next-auth/client'
import { Button } from 'react-bootstrap'

export default function Page () {

	const router = useRouter()
	const [ session, loading ] = useSession()

	useEffect(() => {
		if(session) {
			router.push('/projects')
		}
	}, [session]);

	return(
		<>
			<h2 style={{textAlign: 'center', padding: '1em 0'}}>Welcome 👋 to the Digital Public Goods Alliance crowdsourcing tool!</h2>
			<p>Here, you can <b>validate digital public good submissions</b> to ultimately help us achieve the Sustainable Development Goals by 2030.</p>
			<p>By donating your time, you’ll help us <b>build an open source database</b> of digital public goods that anyone can use to create a more equitable world. <b>Read information about a nominated project, check the evidence to confirm its accuracy and share your review</b>. It’s that simple!</p>
			<p>In order to use this tool, you’ll need to sign in through GitHub. If you don’t have an account don’t worry it only takes a moment to <a href="https://github.com/join" target="_blank">create one</a>! This web application will use your credentials to submit your review at the end by opening a pull request to our repository on your behalf. This application is open source, and you can review the <a href="https://github.com/lacabra/validate-digitalpublicgoods" target="_blank">source code</a> at any time.</p>
			<p>Thank you for supporting digital public goods for a more equitable world! Ready to get started?</p>
			<div className="text-center">

				<Button
				className='actionButton'
				style={{width: '80px'}}
				variant="primary"
				onClick={(e) => {
					e.preventDefault()
					signIn('github', {callbackUrl: '/projects'})
				}}>
					Sign in
				</Button>

			</div>
			<p style={{fontSize: '0.7em', color: 'grey', paddingTop: '2em'}}>*This application will request the authentication <code>public_repo</code> scope in order to be able to open a pull request on your behalf.<br/> Refer to GitHub's documentation <a href="https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/" target="_blank">Understanding scopes for OAuth Apps</a> for additional information.</p>
		</>
	)
}
