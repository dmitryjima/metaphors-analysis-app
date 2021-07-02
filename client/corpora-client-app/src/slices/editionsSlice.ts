import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchAllEditions, createNewEdition, updateEdition, deleteEdition, updateEditionPicture } from '../api/endpoints/editions';

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

        if(editionsFromAPI && editionsFromAPI.length > 0) {
            dispatch(_setEditions({
                editions: editionsFromAPI
            }));
        }
        dispatch(_setEditionsLoading(false));
    } catch (err) {
        dispatch(_setEditionsLoading(false));
        dispatch(_setEditionsLoadingError(err.toString()));
        console.log(err);
    }
}

export const handleAddNewEdition = (
    newEdition: Edition,
    closeModalCallback: Function,
    clearInputCallback: Function
): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(_setAddEditionLoading(true));
        dispatch(_setAddEditionError(''));

        const newlyAddedEdition = await createNewEdition(newEdition);

        if(newlyAddedEdition) {
            dispatch(_addEdition(newlyAddedEdition));
            closeModalCallback();
            clearInputCallback();
        }
        dispatch(_setAddEditionLoading(false));
    } catch (err) {
        dispatch(_setAddEditionLoading(false));
        dispatch(_setAddEditionError(err.toString()));
        console.log(err);
    }
}

export const handleUpdateEdition = (
    editionToUpdate: Edition,
    closeModalCallback?: Function,
    clearEditionToUpdateCallback?: Function
): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(_setUpdateEditionLoading(true));
        dispatch(_setUpdateEditionError(''));

        const updatedEdition = await updateEdition(editionToUpdate);

        if (updatedEdition) {
            dispatch(_updateEdition(updatedEdition));
            closeModalCallback && closeModalCallback();
            clearEditionToUpdateCallback && clearEditionToUpdateCallback()
        }
        dispatch(_setUpdateEditionLoading(false));
    } catch (err) {
        dispatch(_setUpdateEditionLoading(false));
        dispatch(_setUpdateEditionError(err.toString()));
        console.log(err);
    }
}

export const handleUpdateEditionPicture = (
    formData: FormData
): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(_setUpdateEditionLoading(true));
        dispatch(_setUpdateEditionError(''));

        const updatedEdition = await updateEditionPicture(formData);

        if (updatedEdition) {
            dispatch(_updateEdition(updatedEdition));
        }
        dispatch(_setUpdateEditionLoading(false));
    } catch (err) {
        dispatch(_setUpdateEditionLoading(false));
        dispatch(_setUpdateEditionError(err.toString()));
        console.log(err);
    }
}

export const handleDeleteEdition = (
    editionToDelete: Edition,
    closeModalCallback: Function,
    clearEditionToDelete: Function
): AppThunk => async (dispatch, getState) => {
    try {
        dispatch(_setRemoveEditionLoading(true));
        dispatch(_setRemoveEditionError(''));

        const deletedEdition = await deleteEdition(editionToDelete._id!!)

        if(deletedEdition) {
            dispatch(_removeEditionById(deletedEdition._id));
            closeModalCallback();
            clearEditionToDelete();
        }
        dispatch(_setRemoveEditionLoading(false));
    } catch (err) {
        dispatch(_setRemoveEditionLoading(false));
        dispatch(_setRemoveEditionError(err.toString()));
        console.log(err);
    }
}




export default editions.reducer;