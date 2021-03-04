import React, { Component } from "react";
import { useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from 'axios';
import Berry from "./Berry";

//styles
const berryListStyle = {
	display: 'flex',
	flexFlow: 'row wrap',
	overflowY: 'scroll',
	width: '75vw',
	height: '75vh',
}
const berryListBodyStyle = {
	display: 'flex',
	flexFlow: 'row wrap',
	alignItems: 'start',
	width: '80%',
	height: '100%',
	marginRight: '2.5%',
	transition: '0.4s ease',
}
const berryListBodyStyleOverlay = {
	display: 'flex',
	flexFlow: 'row wrap',
	alignItems: 'start',
	width: '80%',
	height: '100%',
	marginRight: '2.5%',
	opacity: '0.25',
	transition: '0.4s ease',
}
const berryControlsStyle = {
	display: 'flex',
	flexFlow: 'column',
	alignItems: 'start',
	width: '15%',
	height: '100%',
}


function Home() {
	//state
	let [berryList, setBerryList ] = useState([]);
	let [inBerryDetailView, setInBerryDetailView] = useState(false);

	//call getBerries when the this component is rendered
	useEffect( () => {
		getBerries();
	}, [])

	//api request to get all 64 berries
	const getBerries = () => {
		axios.get('https://pokeapi.co/api/v2/berry/?limit=64&offset=0').then(( response ) => {
			console.log(response.data.results)
			setBerryList(() => berryList = response.data.results );
		})
	}

	return (
		<>
			{/*main container of berries*/}
			<Card style={berryListStyle}>
				<Card.Body style={berryListBodyStyle}>
					{/*use map to iterrate through the list of berries return from get berries*/}
					{
						berryList.map((berry, index) =>
							// put each berry in a Berry component
							<Berry key={index} berry={berry}/>
						)
					}
				</Card.Body>

				<Card.Body style={berryControlsStyle}>
					content
				</Card.Body>
			</Card>
		</>
	);
}

export default Home