import React, { Component } from "react";
import { useState } from 'react';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";




function StartInfo() {
	const [show, setShow] = useState(true);

	return (
		<>
			<Alert show={show} variant="info">
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

			{!show && <Button className="mb-2" onClick={() => setShow(true)}>Show Info</Button>}
		</>
	);
}

export default StartInfo