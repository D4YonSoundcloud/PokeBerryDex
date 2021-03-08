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
	marginBottom: '12px',
}
const berryListBodyStyle = {
	display: 'flex',
	flexFlow: 'row wrap',
	alignContent: 'flex-start',
	width: '60%',
	height: '100%',
	marginRight: '0.5%',
	transition: '0.4s ease',
}
const berryControlsStyle = {
	display: 'flex',
	flexFlow: 'column',
	alignItems: 'center',
	textAlign: 'left',
	width: '15%',
	height: '100%',
}


function Home() {

	//state
	let [berryList, setBerryList ] = useState([]);
	let [berryLoadedState, setBerryLoadedState ] = useState(true);
	let [inBerryDetailView, setInBerryDetailView] = useState(false);
	let [filterState, setFilterState] = useState({
		firmness: '',
		firmnessSet: false,
		growth: undefined,
		growthSet: false,
		growthUnderOver: 'under',
		naturalGift: '',
		naturalGiftSet: false,
	})
	let [filterSet, setFilterSet] = useState(false)
	let [berryListener, setBerryListener] = useState(false)
	let [growthUnderOverState, setGrowthOverUnderState] = useState('under')
	let [growthRateOptions, setGrowthRateOptions] = useState([5,10,15,30])
	let [selectedGrowthRate, setSelectedGrowthRate] = useState(undefined)
	let [showAllDetail, setShowAllDetail] = useState(false)
	let [naturalGiftTypeOptions, setNaturalGiftTypeOptions] = useState([
		'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon',
		'dark', 'steel',
	])
	let [selectedNaturalGift, setSelectedNaturalGift] = useState(undefined)

	//call getBerries when the this component is rendered
	useEffect( () => {

		getBerries();
	}, [])

	const editFilter = (keyToEdit, keyToEditValue, booleanToEdit, booleanToEditValue, extraKey = false, extraKeyToEdit, extraKeyToEditValue) => {
		//if filter is set to false, then just set it to true
		if(filterSet === false) setFilterSet(true);
		//if there is no extra key (extra keys are things like over/under with growth time)
		if(extraKey === false) {
			//if the key to edit is natural gift type, then set the natural gift string to the selected natural growth
			if(keyToEdit === 'naturalGift') setSelectedNaturalGift(keyToEditValue)
			//set the filter state, using the keys and values passed in from calling the function in our render method
			setFilterState(Object.assign(filterState, {
				[keyToEdit]: keyToEditValue,
				[booleanToEdit]: booleanToEditValue
			}))
		} else {
			//if the key to edit is growth, or growth time, then set the growth value to the selected growth
			if(keyToEdit === 'growth') setSelectedGrowthRate(keyToEditValue)
			//if there is no firmness yet set, then set it 'soft' by default, which is the first option in our select
			//else, then just set the object with the keys and values passed in, including the extra key and extra value
			setFilterState(Object.assign(filterState, {
				[keyToEdit]: keyToEditValue,
				[booleanToEdit]: booleanToEditValue,
				[extraKeyToEdit]: extraKeyToEditValue,
			}))
		}
		//toggle the berry listener to either true or false, react has a hard time listening for changes to properties of a nested object
		//which would be the filter object, passed into our props object, which we pass to each berry, so instead, we are just passing
		//a boolean to our props object, and listen for that instead, which we know will change every time the filter changes
		setBerryListener(!berryListener);
	}

	//resets the filter
	const resetFilter = () => {
		//set show filter to false
		setFilterSet(false);
		//reset the filter state object
		setFilterState(Object.assign(filterState, {
			firmness: '',
			firmnessSet: false,
			growth: undefined,
			growthSet: false,
			growthUnderOver: 'under',
			naturalGift: '',
			naturalGiftSet: false,
		}))
		//toggle the berry listener
		setBerryListener(!berryListener);
		//set show all detail to false
		setShowAllDetail(false);
	}

	//sets the growth to either under of over whenever the button is pressed
	const setGrowthUnderOver = () => {
		if(growthUnderOverState === 'over') {
			setGrowthOverUnderState(growthUnderOverState = 'under')
		} else if(growthUnderOverState === 'under') {
			setGrowthOverUnderState(growthUnderOverState = 'over')
		}
		//call edit filter, passing in the new under or over string, along with the growth value, this triggers the berries to update
		setTimeout(() => {
			editFilter('growth', selectedGrowthRate, 'growthSet', true, true, 'growthUnderOver', growthUnderOverState)
		},100)
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
							<Berry key={index} props={{berry: berry, filter: filterState, filterSet: filterSet, berryListener: berryListener, showAllDetails: showAllDetail}}/>
						)
					}
				</Card.Body>

				{/*berry filter controls*/}
				<Card.Body style={berryControlsStyle}>
					<h5> Berry Filters </h5>
					<Form style={{display: 'flex', flexFlow: 'column', width: '100%', alignItems: 'center'}}>
						<Form.Group style={{display: 'flex', flexFlow: 'column', width: '80%'}}>
							<Form.Label>
								Firmness
							</Form.Label>
							<Form.Control onChange={e => editFilter('firmness', e.target.value, 'firmnessSet', true)} as="select" size="md">
								<option value={'soft'}>soft berries</option>
								<option value={'very-soft'}>very-soft berries</option>
								<option value={'hard'}>hard berries</option>
								<option value={'super-hard'}>super-hard berries</option>
								<option value={'very-hard'}>very-hard berries</option>
							</Form.Control>
						</Form.Group>
						<Form.Group style={{display: 'flex', flexFlow: 'column', width: '80%'}}>
							<Form.Label>
								Growth Time
							</Form.Label>
							<Form.Control onChange={e => editFilter('growth', e.target.value, 'growthSet', true, true, 'growthUnderOver', growthUnderOverState)} as="select" size="md">
								<option value={growthRateOptions[0]}>5</option>
								<option value={growthRateOptions[1]}>10</option>
								<option value={growthRateOptions[2]}>15</option>
								<option value={growthRateOptions[3]}>30</option>
							</Form.Control>
							<Button variant={'primary'} onClick={() => setGrowthUnderOver()} style={{marginTop: '8px'}}>
								{growthUnderOverState}
							</Button>
						</Form.Group>
						<Form.Group style={{display: 'flex', flexFlow: 'column', width: '80%'}}>
							<Form.Label>
								Natural Gift Type
							</Form.Label>
							<Form.Control onChange={e => editFilter('naturalGift', e.target.value, 'naturalGiftSet', true)} as="select" size="md">
								<option value={naturalGiftTypeOptions[0]}>Fire</option>
								<option value={naturalGiftTypeOptions[1]}>Water</option>
								<option value={naturalGiftTypeOptions[2]}>Electric</option>
								<option value={naturalGiftTypeOptions[3]}>Grass</option>
								<option value={naturalGiftTypeOptions[4]}>Ice</option>
								<option value={naturalGiftTypeOptions[5]}>Fighting</option>
								<option value={naturalGiftTypeOptions[6]}>Poison</option>
								<option value={naturalGiftTypeOptions[7]}>Ground</option>
								<option value={naturalGiftTypeOptions[8]}>Flying</option>
								<option value={naturalGiftTypeOptions[9]}>Psychic</option>
								<option value={naturalGiftTypeOptions[10]}>Bug</option>
								<option value={naturalGiftTypeOptions[11]}>Rock</option>
								<option value={naturalGiftTypeOptions[12]}>Ghost</option>
								<option value={naturalGiftTypeOptions[13]}>Dragon</option>
								<option value={naturalGiftTypeOptions[14]}>Dark</option>
								<option value={naturalGiftTypeOptions[15]}>Steel</option>
							</Form.Control>
						</Form.Group>
						<Form.Group style={{display: 'flex', flexFlow: 'column', width: '80%'}}>
							<Form.Label>
								Details
							</Form.Label>
							<Button variant={showAllDetail ? 'danger' : 'primary'} onClick={() => setShowAllDetail(!showAllDetail)}>
								{showAllDetail ? 'Hide All' : 'Show All'}
							</Button>
						</Form.Group>
						<Form.Group style={{display: 'flex', flexFlow: 'column', width: '80%'}}>
							<Button variant={'success'} onClick={() => resetFilter()}>
								Clear Filters
							</Button>
						</Form.Group>
					</Form>
				</Card.Body>
			</Card>
		</>
	);
}

export default Home