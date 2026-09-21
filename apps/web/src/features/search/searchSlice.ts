import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "../../app/store";

/**
 * Restores the last search query when returning to search page
 */
interface SearchState {
    lastQueryString: string;
}


const initialState: SearchState = {
    lastQueryString: ""
}


const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        searchParamsChanged(state, action:PayloadAction<string>){
            state.lastQueryString = action.payload
        }
    }
})


export const {searchParamsChanged} = searchSlice.actions;
export const selectLastSearch = (state: RootState) =>
  state.search.lastQueryString;
export default searchSlice.reducer;