import { axiosInstance as axios } from '../axiosInstance';
import { Article } from '../dataModels';
import { BASE_URL } from '../url';


/**
 * Create new article
 * @async
 * @function createNewArticle
*/
export async function createNewArticle(newArticle: Article): Promise<Article> {

    const payload = {
        newArticle
    }

    const { data } = await axios.post(
        `${BASE_URL}/api/articles/create_new`,
        payload
    );

    return data;
}

/**
 * Fetches the list of articles
 * @async
 * @function fetchAllArticles
*/
export async function fetchAllArticles(): Promise<Array<Article>> {
    const { data } = await axios.get(
        `${BASE_URL}/api/articles/`
    );

    return data;
}

/**
 * Fetches the list of articles by edition's id
 * @async
 * @function fetchArticlesByArticleId
*/
export async function fetchArticlesByArticleId(editionId: string): Promise<Array<Article>> {
    const { data } = await axios.get(
        `${BASE_URL}/api/articles/edition/${editionId}`
    );

    return data;
}

/**
 * Update article body
 * @async
 * @function updateArticleBody
*/
export async function updateArticleBody(articleToUpdate: Article): Promise<Article> {

    const payload = {
        id: articleToUpdate._id,
        updatedData: articleToUpdate
    }

    const { data } = await axios.put(
        `${BASE_URL}/api/articles/update_article_body`,
        payload
    );

    return data;
}

/**
 * Toggle article's annotation status
 * @async
 * @function updateArticleToggleAnnotated
*/
export async function updateArticleToggleAnnotated(id: string): Promise<Article> {

    const payload = {
        id
    }

    const { data } = await axios.put(
        `${BASE_URL}/api/articles/update_article_toggle_annotated`,
        payload
    );

    return data;
}

/**
 * Update article's comment and/or tone
 * @async
 * @function updateArticleCommentTone
*/
export async function updateArticleCommentTone(
    id: string,
    comment?: string,
    tone?: string
): Promise<Article> {

    const payload = {
        id,
        ...(comment && { comment }),
        ...(tone && { tone })
    }

    const { data } = await axios.put(
        `${BASE_URL}/api/articles/update_article_comment_tone`,
        payload
    );

    return data;
}


/**
 * Delete article
 * @async
 * @function deleteArticle
*/
export async function deleteArticle(id: string): Promise<Article> {

    const payload = {
        id
    }

    const { data } = await axios.delete(
        `${BASE_URL}/api/articles/delete`,
        {
            data: payload
        }
    );

    return data;
}