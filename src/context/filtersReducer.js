import { SET_FILTERS, SET_FILTER_SET } from "./type";

export default (state, action) => {
	switch (action.type) {
		case SET_FILTERS: console.log(state.filters, action.payload.keyToEdit, action.payload.keyToEditValue);
			return state = Object.assign(state,{
				filters: Object.assign(state.filters, {
					[action.payload.keyToEdit]: action.payload.keyToEditValue,
					[action.payload.booleanToEdit]: action.payload.booleanToEditValue
				})
			});
		case SET_FILTER_SET: console.log(state.filterSet, action.payload.boolToSet)
			return state = Object.assign(state, state,{
				'filterSet': action.payload.boolToSet
			})
		default:
			return state;
	}
};