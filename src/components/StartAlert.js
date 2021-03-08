import React, { Component } from "react";
import { useState } from 'react';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const infoContainerStyle = {
	display: 'flex',
	flexFlow: 'row',
	justifyContent: 'space-between',
	alignItems: 'flex-start',
	marginTop: '0.25%',
	width: '75vw'
}

const linkStyle = {
	cursor: 'pointer',
	'&:hover': {
		color: 'blue',
	},
}


function StartInfo() {
	const [show, setShow] = useState(false);

	return (
		<>
			{
				show ? <Alert variant="info" style={{marginRight: 'auto', marginLeft: '15vw'}}>
					<Alert.Heading>Hey There!</Alert.Heading>
					<p>
						This is a PokeBerryDex! Useful for looking up or browsing PokeBerries and their effects
						on pokemon!
					</p>
					<hr />
					<div className="d-flex justify-content-end">
						<Button onClick={() => setShow(false)} variant="outline-success">
							Got it!
						</Button>
					</div>
				</Alert>
					:
				<div style={infoContainerStyle}>
					<Button className="mb-2" style={{marginLeft: '1.25%'}} onClick={() => setShow(true)}>Show Info</Button>
					<p>Created By <strong style={linkStyle} onClick={() => window.location.href = 'https://www.mattdayweb.dev'}>Matt Day</strong></p>
				</div>
			}
		</>
	);
}

export default StartInfo