import React, { Component } from "react";
import { useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from 'axios';
import Berry from "./Berry";


const berryListStyle = {
	display: 'flex',
	flexFlow: 'row wrap',
	overflowY: 'scroll',
	width: '50rem',
	height: '45rem',
}
const berryListBodyStyle = {
	display: 'flex',
	flexFlow: 'row wrap',
	alignItems: 'start',
	width: '100%',
	height: '100%',
}


function Home() {

	let [berryList, setBerryList ] = useState([]);

	useEffect( () => {
		getBerries();
	}, [])

	const getBerries = () => {
		axios.get('https://pokeapi.co/api/v2/berry/?limit=64&offset=0').then(( response ) => {
			console.log(response.data.results)
			setBerryList(() => berryList = response.data.results );
		})
	}

	return (
		<>
			<Card style={berryListStyle}>
				<Card.Body style={berryListBodyStyle}>
					{
						berryList.map((berry, index) =>
							<Berry key={index} berry={berry}/>
						)
					}
				</Card.Body>
			</Card>
		</>
	);
}

export default Home