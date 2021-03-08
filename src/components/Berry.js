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
	width: '14.25rem',
	marginLeft: '0.5rem',
	marginRight: '0.5rem',
	marginBottom: '1rem',
	height: '5rem',
	cursor: 'pointer',
}
const berryStyleFocus = {
	display: 'flex',
	flexFlow: 'row',
	width: '14.25rem',
	marginLeft: '0.5rem',
	marginRight: '0.5rem',
	marginBottom: '1rem',
	height: '29rem',
	cursor: 'pointer',
}
const berryBodyStyle = {
	display: 'flex',
	flexFlow: 'row',
	cursor: 'pointer',
}
const berryBodyDetailsStyle = {
	display: 'flex',
	flexFlow: 'column',
	cursor: 'pointer',
}


function Berry(props) {

	//state
	let [berryDetails, setBerryDetails] = useState([]);
	let [berryEffects, setBerryEffect] = useState('');
	let [berrySprite, setBerrySprite] = useState('');
	let [berryDetailsShown, setBerryDetailsShown] = useState(false)
	let [showBerry, setShowBerry] = useState(true)

	//runs every-time there is a change to the filters list
	useEffect(() => {
		checkFilters();
	}, [props.props.berryListener])

	//created(), runs the first time the component is rendered
	//call an api request on each berry using its name, along with its item url, using the item url, we can then find the effect
	//of the berry, and the url of the sprite for it, letting us get the sprite next to the name of the berry!
	useEffect( () => {
		axios.get(`https://pokeapi.co/api/v2/berry/${props.props.berry.name}`).then(( response ) => {
			setBerryDetails(() => berryDetails = response.data );
			axios.get(response.data.item.url).then((response) => {
				setBerryEffect(response.data['effect_entries'][0]['short_effect']);
				setBerrySprite(response.data['sprites'].default);
			})
		}).then(() => {
			checkFilters(props.props.filter, props.props.filterSet) })
	}, [])

	//watcher for if showAllDetails is changed in Home.js, will show set the details to either true or false
	useEffect(() => {
		if(props.props.showAllDetails === true) {
			setBerryDetailsShown(true);
		} else {
			setBerryDetailsShown(false);
		}
	}, [props.props.showAllDetails])

	//first time writing a somewhat complex filter algorithm, so I'm assuming there are improvements that could be made
	//decides to go with a recursive function that will call itself if a filter condition is met, until there are none left that match,
	//or there was none in the first place
	const checkFilters = (firmnessTrue, growthTrue, naturalGiftTrue) => {
		console.log(props.props.filter['growth'], berryDetails['growth_time'], props.props.filter,)

		//grab what we need from the props, and set them equal to local variables, so we don't have to read down the props object each
		//time we want to compare them
		let filterSet = props.props.filterSet;
		let firmnessSet = props.props.filter['firmnessSet'];
		let filterFirmnessString = props.props.filter['firmness'];
		let growthSet = props.props.filter['growthSet'];
		let growthUnderOver = props.props.filter['growthUnderOver'];
		let filterGrowthValue = props.props.filter['growth'];
		let naturalGiftType = props.props.filter['naturalGift'];
		let naturalGiftSet = props.props.filter['naturalGiftSet'];

		if(filterSet === false) setShowBerry(true)

		if(filterSet === true) {
			//only run once to check if berryName is a match, then recursively call again to check if more filters match
			if(firmnessSet === true && firmnessTrue !== true) {
				//recursive condition
				if(berryDetails.firmness.name === filterFirmnessString) {
					setShowBerry(true)
					console.log('i have been called first loop')
					return checkFilters(true, false, false)
				} else {
					setShowBerry(false)
				}
			}
			if(growthSet === true && growthTrue !== true) {
				//recursive condition
				if(growthUnderOver === 'under') {
					if(berryDetails['growth_time'] <= parseFloat(filterGrowthValue)) {
						setShowBerry(true)
						//if firmness is set to false, but there is growth time, then recursively call this, passing true for the firmness
						if(firmnessSet === false){
							return checkFilters(true, true, false)
						}
						return checkFilters(firmnessTrue, true, naturalGiftTrue)
					} else {
						setShowBerry(false)
					}
				} else if (growthUnderOver === 'over') {
					if(berryDetails['growth_time'] >= parseFloat(filterGrowthValue)) {
						setShowBerry(true)
						if(firmnessSet === false){
							return checkFilters(true, true, false)
						}
						return checkFilters(firmnessTrue, true, naturalGiftTrue)
					} else {
						setShowBerry(false)
					}
				}
			}
			if(naturalGiftSet === true && naturalGiftTrue !== true) {
				//recursive condition
				if(berryDetails['natural_gift_type'].name === naturalGiftType) {
					setShowBerry(true)
					return checkFilters(firmnessTrue, growthTrue, true)
				} else {
					setShowBerry(false)
				}
			}

			//if statement at the end of the function, checks if it has been recursively called
			if(firmnessSet === true && firmnessTrue === true){
				if(growthSet !== true && naturalGiftSet !== true) {
					console.log('i have been called in the final if')
					return setShowBerry(true);
				}
				finalCheck(growthSet, growthTrue, naturalGiftSet, naturalGiftTrue)
			} else {
				if((growthSet !== true && naturalGiftSet !== true) || firmnessSet === true) {
					return setShowBerry(false);
				}
				finalCheck(growthSet, growthTrue, naturalGiftSet, naturalGiftTrue);
			}
		}
	}

	//final check function for our checkFilters function
	const finalCheck = (growthSetBool, growthLoopBool, naturalGiftSetBool, naturalGiftLoopBool) => {
		if(growthSetBool === true && growthLoopBool === true) {
			if(naturalGiftSetBool === true && naturalGiftLoopBool === true){
				return setShowBerry
			} else if (naturalGiftSetBool !== true) {
				return setShowBerry(true)
			} else {
				return setShowBerry(false)
			}
		} else if (growthSetBool !== true) {
			if(naturalGiftSetBool === true && naturalGiftLoopBool === true){
				return setShowBerry
			} else if (naturalGiftSetBool !== true) {
				return setShowBerry(true)
			} else {
				return setShowBerry(false)
			}
		} else {
			return setShowBerry(false)
		}
	}

	//toggles the berry details
	const toggleBerryDetails = () => {
		if(berryDetailsShown === true) {
			setBerryDetailsShown(false)
		} else {
			setBerryDetailsShown(true)
		}
	}

	return (
		<>
			{ showBerry === true &&
				<Card style={berryDetailsShown ? berryStyleFocus : berryStyle} bg={berryColorLookUpTable[props.props.berry.name]} onClick={() => toggleBerryDetails()}
				      text={berryColorLookUpTable[props.props.berry.name] === 'light' ? 'dark' : 'white'}>
					<Card.Body style={berryDetailsShown ? berryBodyDetailsStyle : berryBodyStyle}>
						{/*title of the berry plus the berry sprite (src url gotten from berrySprite state)*/}
						<Card.Title onClick={() => toggleBerryDetails()}>{props.props.berry.name} <img src={berrySprite}/></Card.Title>
						{berryDetailsShown
							// if berryDetailsShown = true
							? <div onClick={() => toggleBerryDetails()} style={{height: '100%', width: '100%'}}>
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
							: <Button variant={berryColorLookUpTable[props.props.berry.name]} onClick={() => toggleBerryDetails()}
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