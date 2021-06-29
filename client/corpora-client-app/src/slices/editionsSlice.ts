import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchAllEditions, createNewEdition, updateEdition, deleteEdition } from '../api/endpoints/editions';

// Toasts
import { toast } from 'react-toastify';

import { Edition } from '../api/dataModels';
import { AppThunk } from '../app/store';

export interface editionsState {
    editions: Edition[],
    isEditionsLoading: boolean,
    editionsLoadingError?: string,
    addNewEditionLoading: boolean,
    addNewEditionError?: string,
    removeEditionLoading: boolean,
    removeEditionError?: string,
    updateEditionLoading: boolean,
    updateEditionError?: string
}

const defaultState: editionsState = {
    editions: [],
    isEditionsLoading: false,
    addNewEditionLoading: false,
    removeEditionLoading: false,
    updateEditionLoading: false
}

const initialState = defaultState;

export const editions = createSlice({
    name: 'editions',
    initialState,
    reducers: {
        _setEditions(state, action) {
            const { editions } = action.payload;
            state.editions = [...editions]
        },
        _setEditionsLoading(state, action) {
            state.isEditionsLoading = action.payload
        },
        _setEditionsLoadingError(state, action) {
            state.editionsLoadingError = action.payload
        },
        _addEdition(state, action: PayloadAction<Edition>) {
            const newEdition = action.payload;
            state.editions.push(newEdition)
        },
        _setAddEditionLoading(state, action) {
            state.addNewEditionLoading = action.payload
        },
        _setAddEditionError(state, action) {
            state.addNewEditionError = action.payload
        },
        _removeEditionById(state, action) {
            const editionToRemoveId = action.payload;
            state.editions = state.editions.filter(item => item._id !== editionToRemoveId)
        },
        _setRemoveEditionLoading(state, action) {
            state.removeEditionLoading = action.payload
        },
        _setRemoveEditionError(state, action) {
            state.removeEditionError = action.payload
        },
        _updateEdition(state, action: PayloadAction<Edition>) {
            let index = state.editions.findIndex(e => e._id === action.payload._id)
            state.editions[index] = {...action.payload}
        },
        _setUpdateEditionLoading(state, action) {
            state.updateEditionLoading = action.payload
        },
        _setUpdateEditionError(state, action) {
            state.updateEditionError = action.payload
        }
    }
});

export const {
    _setEditions,
    _setEditionsLoading,
    _setEditionsLoadingError,
    _addEdition,
    _removeEditionById,
    _setAddEditionLoading,
    _setAddEditionError,
    _setRemoveEditionLoading,
    _setRemoveEditionError,
    _setUpdateEditionLoading,
    _setUpdateEditionError,
    _updateEdition
} = editions.actions;


export const handleFetchEditions = (): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(_setEditionsLoading(true));
        dispatch(_setEditionsLoadingError(''));

        const editionsFromAPI = await fetchAllEditions()

        console.log(editionsFromAPI)

        if(editionsFromAPI && editionsFromAPI.length > 0) {
            dispatch(_setEditions({
                editions: editionsFromAPI
            }));

            let state = getState();
            console.log(state)
        }
        dispatch(_setEditionsLoading(false));
    } catch (err) {
        dispatch(_setEditionsLoading(false));
        dispatch(_setEditionsLoadingError(err.toString()));
        console.log(err);
    }
}

export const handleAddNewEdition = (
    newEdition: Edition
): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(_setAddEditionLoading(true));
        dispatch(_setAddEditionError(''));

        const newlyAddedEdition = await createNewEdition(newEdition);

        console.log(newlyAddedEdition)

        if(newlyAddedEdition) {
            dispatch(_addEdition(newlyAddedEdition));

            let state = getState();
            console.log(state.editions)
        }
        dispatch(_setAddEditionLoading(false));
    } catch (err) {
        dispatch(_setAddEditionLoading(false));
        dispatch(_setAddEditionError(err.toString()));
        console.log(err);
    }
}

export const handleUpdateEdition = (
    editionToUpdate: Edition
): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(_setUpdateEditionLoading(true));
        dispatch(_setUpdateEditionError(''));

        const updatedEdition = await updateEdition(editionToUpdate);

        console.log(updatedEdition)

        if (updatedEdition) {
            dispatch(_updateEdition(updatedEdition));

            let state = getState();
            console.log(state.editions)
        }
        dispatch(_setUpdateEditionLoading(false));
    } catch (err) {
        dispatch(_setUpdateEditionLoading(false));
        dispatch(_setUpdateEditionError(err.toString()));
        console.log(err);
    }
}

export const handleDeleteEdition = (
    editionToDelete: Edition
): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(_setRemoveEditionLoading(true));
        dispatch(_setRemoveEditionError(''));

        const deletedEdition = await deleteEdition(editionToDelete._id!!)

        console.log(deletedEdition)

        if(deletedEdition) {
            dispatch(_removeEditionById(deletedEdition._id));

            let state = getState();
            console.log(state.editions)
        }
        dispatch(_setRemoveEditionLoading(false));
    } catch (err) {
        dispatch(_setRemoveEditionLoading(false));
        dispatch(_setRemoveEditionError(err.toString()));
        console.log(err);
    }
}




export default editions.reducer;