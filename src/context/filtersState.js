import React, { useReducer } from "react";
import filtersReducer from "./filtersReducer";
import {
	SET_FILTERS,
	SET_FILTER_SET
} from "./type";
import FiltersContext from "./filtersContext";

const FiltersState = props => {
	const initialFiltersState = {
		filterSet: false,
		filters:{
			firmness: '',
			firmnessSet: false,
		}
	};

	const [filtersState, dispatch] = useReducer(filtersReducer, initialFiltersState);

	//edit filter option
	const editFilter = (keyToEdit, keyToEditValue, booleanToEdit, booleanToEditValue) => {
		console.log(keyToEdit, keyToEditValue, booleanToEdit, booleanToEditValue)
		dispatch({
			type: SET_FILTERS,
			payload: { keyToEdit, keyToEditValue, booleanToEdit, booleanToEditValue }
		});
	};

	//set if filter is set
	const setFilterSet = (boolToSet) => {
		dispatch({
			type: SET_FILTER_SET,
			payload: { boolToSet }
		})
	}

	return (
		<FiltersContext.Provider
			value={{
				filtersState: filtersState,
				editFilter,
				setFilterSet,
			}}
		>
			{props.children}
		</FiltersContext.Provider>
	);
};

export default FiltersState;