import { axiosInstance as axios } from '../axiosInstance';
import { Edition } from '../dataModels';
import { BASE_URL } from '../url';


/**
 * Fetches the list of editions
 * @async
 * @function fetchAllEditions
*/
export async function fetchAllEditions(): Promise<Array<Edition>> {
    const { data } = await axios.get(
        `${BASE_URL}/api/editions/`
    );

    return data;
}

/**
 * Create new edition
 * @async
 * @function createNewEdition
*/
export async function createNewEdition(newEdition: Edition): Promise<Edition> {

    const payload = {
        name: newEdition.name,
        lang: newEdition.lang,
        ...(newEdition.description && { description: newEdition.description })
    }

    const { data } = await axios.post(
        `${BASE_URL}/api/editions/create_new`,
        payload
    );

    return data;
}

/**
 * Update edition
 * @async
 * @function updateEdition
*/
export async function updateEdition(editionToUpdate: Edition): Promise<Edition> {

    const payload = {
        id: editionToUpdate._id,
        updatedData: editionToUpdate
    }

    const { data } = await axios.put(
        `${BASE_URL}/api/editions/update`,
        payload
    );

    return data;
}

/**
 * Update edition picture
 * @async
 * @function updateEditionPicture
*/
export async function updateEditionPicture(
    formDataPayload: FormData
): Promise<Edition> {

    const { data } = await axios.post(
        `${BASE_URL}/api/editions/update_picture`,
        formDataPayload
    );

    return data;
}

/**
 * Delete edition
 * @async
 * @function deleteEdition
*/
export async function deleteEdition(id: string): Promise<Edition> {

    const payload = {
        id
    }

    const { data } = await axios.delete(
        `${BASE_URL}/api/editions/delete`,
        {
            data: payload
        }
    );

    return data;
}