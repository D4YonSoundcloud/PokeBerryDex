import React, { Component } from "react";
import { useState, useEffect, useContext } from 'react';
import Button from "react-bootstrap/Button";
import FiltersContext from "../context/filtersContext";
import Card from "react-bootstrap/Card";
import axios from 'axios';
import Berry from "./Berry";
import Form from 'react-bootstrap/Form'

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
	width: '60%',
	height: '100%',
	marginRight: '0.5%',
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
	zIndex: 1,
}
const berryControlsStyle = {
	display: 'flex',
	flexFlow: 'column',
	alignItems: 'start',
	width: '15%',
	height: '100%',
}


function Home() {
	const filtersContext = useContext(FiltersContext)

	//state
	let [berryList, setBerryList ] = useState([]);
	let [berryLoadedState, setBerryLoadedState ] = useState(true);
	let [inBerryDetailView, setInBerryDetailView] = useState(false);
	let [filterState, setFilterState] = useState({
		firmness: '',
		firmnessSet: false
	})
	let [filterSet, setFilterSet] = useState(false)
	// let { filtersState, editFilter, setFilterSet } = filtersContext
	// let { filterSet, filters } = filtersState

	//call getBerries when the this component is rendered
	useEffect( () => {
		getBerries();
	}, [])

	const editFilterContext = (keyToEdit, keyToEditValue, booleanToEdit, booleanToEditValue) => {
		if(filterSet === false) setFilterSet(true);
		setFilterState(Object.assign(filterState, {
			[keyToEdit]: keyToEditValue,
			[booleanToEdit]: booleanToEditValue
		}))
		console.log(filterState, filterSet)
	}

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
					{/*use map to iterate through the list of berries return from get berries*/}
					{
						berryList.map((berry, index) =>
							// put each berry in a Berry component
							<Berry key={index} props={{berry: berry, filter: filterState, filterSet: filterSet}}/>
						)
					}
				</Card.Body>

				<Card.Body style={berryControlsStyle}>
					<h5> Berry Filters </h5>
					<Form>
						<Form.Group>
							<Form.Label>
								Firmness
							</Form.Label>
							<Form.Control onChange={e => editFilterContext('firmness', e.target.value, 'firmnessSet', true)} as="select" size="md">
								<option value={'soft'}>soft berries</option>
								<option value={'very-soft'}>very-soft berries</option>
								<option value={'hard'}>hard berries</option>
								<option value={'super-hard'}>super-hard berries</option>
								<option value={'very-hard'}>very-hard berries</option>
							</Form.Control>
						</Form.Group>
						<Button variant={'success'}>
							APPLY
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</>
	);
}

export default Home