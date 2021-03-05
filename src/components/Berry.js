import React, {Component, useEffect, useContext} from "react";
import { useState } from 'react';
import axios from 'axios';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import FiltersContext from "../context/filtersContext";

//styles
const berryStyle = {
	display: 'flex',
	flexFlow: 'row',
	width: '14rem',
	marginLeft: '0.5rem',
	marginRight: '0.5rem',
	marginBottom: '1rem',
}
const berryStyleFocues = {
	display: 'flex',
	flexFlow: 'row',
	width: '14rem',
	marginLeft: '0.5rem',
	marginRight: '0.5rem',
	marginBottom: '1rem',
}
const berryBodyStyle = {
	display: 'flex',
	flexFlow: 'row',
}
const berryBodyDetailsStyle = {
	display: 'flex',
	flexFlow: 'column',
}


function Berry(props) {
	const filtersContext = useContext(FiltersContext)

	//state
	let [berryDetails, setBerryDetails] = useState([]);
	let [berryEffects, setBerryEffect] = useState('');
	let [berrySprite, setBerrySprite] = useState('');
	let [berryDetailsShown, setBerryDetailsShown] = useState(false)
	let [showBerry, setShowBerry] = useState(true)
	let { filtersState, editFilter, setFilterSet } = filtersContext
	let { filterSet, filters } = filtersState

	useEffect(() => {
		checkFilters();
		console.log('use effect is being called', props.props.filter['firmness'] )
	}, [props.props.filter['firmness']])

	//call an api request on the berry using its name, which will give us the url, and
	useEffect( () => {
		console.log(filtersContext.filtersState.filters.firmnessSet, props.props.filter, props.props.berry.name)
		axios.get(`https://pokeapi.co/api/v2/berry/${props.props.berry.name}`).then(( response ) => {
			setBerryDetails(() => berryDetails = response.data );
			axios.get(response.data.item.url).then((response) => {
				setBerryEffect(response.data['effect_entries'][0]['short_effect']);
				setBerrySprite(response.data['sprites'].default);
			})
		}).then(() => { checkFilters(props.props.filter, props.props.filterSet) })
	}, [])

	const getBerryDetails = ( berryName ) => {
		setBerryDetailsShown(true);
	}

	const checkFilters = (filter, filterSet) => {
		console.log('i am happening', props.props.berry.name)
		if(filterSet === false) setShowBerry(true)
		if(filterSet === true) {
			if(filter.firmnessSet === true) {
				if(berryDetails.firmness.name === filter.firmness) {
					setShowBerry(true)
				} else {
					setShowBerry(false)
				}
			}
		}
	}

	return (
		<>
			{ showBerry === true &&
				<Card style={berryStyle} bg={berryColorLookUpTable[props.props.berry.name]}
				      text={berryColorLookUpTable[props.props.berry.name] === 'light' ? 'dark' : 'white'}>
					<Card.Body style={berryDetailsShown ? berryBodyDetailsStyle : berryBodyStyle}>
						<Card.Title>{props.props.berry.name} <img src={berrySprite} href={props.props.berry.name}></img></Card.Title>
						{berryDetailsShown
							// if berryDetailsShown = true
							? <div style={{height: '100%', width: '100%'}}>
								<Button variant={berryColorLookUpTable[props.props.berry.name]} onClick={() => setBerryDetailsShown(false)}
								        style={{color: 'white', position: 'absolute', top: '5%', right: '5%'}}>
									X
								</Button>
								{/*firmness*/}
								<div style={{width: '100%'}}> Firmness: {' ' + berryDetails.firmness.name}</div>
								{/*flavors*/}
								<div style={{width: '100%', display: 'flex', flexFlow: 'row'}}>
									{/*only show flavors over 0*/}
									Flavor(s): <div style={{width: '60%', display: 'flex', flexFlow: 'column'}}> {berryDetails.flavors.map((flavor, index) =>
									flavor.potency > 0 && <p key={index} style={{marginLeft: '4px', marginBottom: '4px'}}>{' ' + flavor.flavor.name + ' (' + flavor.potency + ')'}</p>
								)} </div>
								</div>
								{/*growth time*/}
								<div style={{width: '100%', display: 'flex', flexFlow: 'row'}}> Growth Time: {' ' + berryDetails['growth_time']}</div>
								{/*item*/}
								{/*max harvest*/}
								<div style={{width: '100%', display: 'flex', flexFlow: 'row'}}> Max Harvest: {' ' + berryDetails['max_harvest']}</div>
								{/*natural gift power*/}
								<div style={{width: '100%', display: 'flex', flexFlow: 'row'}}> Natural Gift Power: {' ' + berryDetails['natural_gift_power']}</div>
								{/*natural gift type*/}
								<div style={{width: '100%', display: 'flex', flexFlow: 'row'}}> Natural Gift Type: {' ' + berryDetails['natural_gift_type'].name}</div>
								{/*size*/}
								<div style={{width: '100%', display: 'flex', flexFlow: 'row'}}> Size: {' ' + berryDetails['size']}</div>
								{/*smoothness*/}
								<div style={{width: '100%', display: 'flex', flexFlow: 'row'}}> Smoothness: {' ' + berryDetails['smoothness']}</div>
								{/*soil dryness*/}
								<div style={{width: '100%', display: 'flex', flexFlow: 'row'}}> Soil Dryness: {' ' + berryDetails['soil_dryness']}</div>
								{/*berry effect*/}
								<div style={{width: '100%', display: 'flex', flexFlow: 'row'}}> Effect(s): {' ' + berryEffects}</div>
								{/*image*/}
							</div>
							//if berryDetailsShown = false
							: <Button variant={berryColorLookUpTable[props.props.berry.name]} onClick={() => getBerryDetails(props.props.berry.name)}
							          style={{color: 'white', marginBottom: '4px', marginLeft: 'auto'}}>
								<svg style={{width: '24px', height: '24px'}} viewBox="0 0 24 24">
									<path fill="white"
									      d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
								</svg>
							</Button>
						}
					</Card.Body>
				</Card>
			}
		</>
	);
}

export default Berry

let berryColorLookUpTable = {
	'cheri': 'danger',
	'chesto': 'dark',
	'pecha': 'danger',
	'rawst': 'info',
	'aspear': 'warning',
	'leppa': 'danger',
	'oran': 'primary',
	'persim': 'warning',
	'lum': 'success',
	'sitrus': 'warning',
	'figy': 'warning',
	'wiki': 'dark',
	'mago': 'danger',
	'aguav': 'success',
	'iapapa': 'warning',
	'razz': 'danger',
	'bluk': 'dark',
	'nanab': 'danger',
	'wepear': 'success',
	'pinap': 'warning',
	'pomeg': 'warning',
	'kelpsy': 'primary',
	'qualot': 'warning',
	'hondew': 'success',
	'grepa': 'warning',
	'tamato': 'danger',
	'cornn': 'dark',
	'magost': 'danger',
	'rabuta': 'success',
	'nomel': 'warning',
	'spelon': 'danger',
	'pamtre': 'dark',
	'watmel': 'success',
	'durin': 'success',
	'belue': 'dark',
	'occa': 'danger',
	'passho': 'primary',
	'wacan': 'warning',
	'rindo': 'success',
	'yache': 'info',
	'chople': 'danger',
	'kebia': 'success',
	'shuca': 'warning',
	'coba': 'info',
	'payapa': 'dark',
	'tanga': 'success',
	'charti': 'warning',
	'kasib': 'dark',
	'haban': 'danger',
	'colbur': 'dark',
	'babiri': 'success',
	'chilan': 'danger',
	'liechi': 'danger',
	'ganlon': 'dark',
	'salac': 'success',
	'petaya': 'danger',
	'apicot': 'dark',
	'lansat': 'danger',
	'starf': 'success',
	'enigma': 'light',
	'micle': 'success',
	'custap': 'danger',
	'jaboca': 'warning',
	'rowap': 'info',
}