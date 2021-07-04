import { axiosInstance as axios } from '../axiosInstance';
import { Article, MetaphorModel, MetaphorCase } from '../dataModels';
import { BASE_URL } from '../url';


export interface NewMetaphorCaseReturn {
    newMetaphorCase: MetaphorCase
    updatedArticle: Article,
    metaphorModel: MetaphorModel
}


export interface DeleteMetaphorCaseReturn {
    deletedCase: MetaphorCase,
    updatedArticle: Article
}


/**
 * Create new metaphor case
 * @async
 * @function createNewMetaphorCase
*/
export async function createNewMetaphorCase(
    articleId: string,
    metaphorCaseBody: MetaphorCase,
    metaphorModel: MetaphorModel
): Promise<NewMetaphorCaseReturn> {

    const payload = {
        articleId,
        metaphorCaseBody,
        metaphorModel
    }

    const { data } = await axios.post(
        `${BASE_URL}/api/metaphors/create_new_metaphor_case`,
        payload
    );

    return data;
}

/**
 * Create new metaphor model
 * @async
 * @function createNewMetaphorModel
*/
export async function createNewMetaphorModel(newModel: MetaphorModel): Promise<MetaphorModel> {

    const payload = {
        newModel
    }

    const { data } = await axios.post(
        `${BASE_URL}/api/metaphors/create_new_metaphor_model`,
        payload
    );

    return data;
}

/**
 * Fetches the list of metaphors by model's id
 * @async
 * @function fetchMetaphorsByModelId
*/
export async function fetchMetaphorsByModelId(
    modelId: string
): Promise<Array<MetaphorCase>> {
    const { data } = await axios.get(
        `${BASE_URL}/api/metaphors/metaphors_by_model/${modelId}`
    );

    return data;
}

/**
 * Fetches the list of all metaphor models
 * @async
 * @function fetchAllMetaphorModels
*/
export async function fetchAllMetaphorModels(): Promise<Array<MetaphorModel>> {
    const { data } = await axios.get(
        `${BASE_URL}/api/metaphors/all_metaphor_models`
    );

    return data;
}


/**
 * Update metaphor case
 * @async
 * @function updateMetaphorCase
*/
export async function updateMetaphorCase(
    caseId: string, 
    updatedDataBody: MetaphorCase,
    updatedDataModel?: MetaphorModel
): Promise<MetaphorCase> {

    const payload = {
        caseId, 
        updatedDataBody,
        ...(updatedDataModel && { updatedDataModel })
    }

    const { data } = await axios.put(
        `${BASE_URL}/api/metaphors/update_metaphor_case`,
        payload
    );

    return data;
}

/**
 * Update metaphor model
 * @async
 * @function updateMetaphorModel
*/
export async function updateMetaphorModel(
    id: string, 
    updatedData: MetaphorModel
): Promise<MetaphorModel> {

    const payload = {
        id,
        updatedData
    }

    const { data } = await axios.put(
        `${BASE_URL}/api/metaphors/update_metaphor_case`,
        payload
    );

    return data;
}



/**
 * Delete metaphor case
 * @async
 * @function deleteMetaphorCase
*/
export async function deleteMetaphorCase(id: string): Promise<DeleteMetaphorCaseReturn> {

    const payload = {
        id
    }

    const { data } = await axios.delete(
        `${BASE_URL}/api/metaphors/delete_metaphor_case`,
        {
            data: payload
        }
    );

    return data;
}

/**
 * Delete metaphor model
 * @async
 * @function deleteMetaphorModel
*/
export async function deleteMetaphorModel(id: string): Promise<MetaphorModel> {

    const payload = {
        id
    }

    const { data } = await axios.delete(
        `${BASE_URL}/api/metaphors/delete_metaphor_model`,
        {
            data: payload
        }
    );

    return data;
}