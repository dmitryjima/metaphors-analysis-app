export interface Edition {
    _id?: string,
    lang: string,
    name: string,
    pictureURL?: string,
    description?: string
}

export interface Article {
    _id?: string,
    heading: string,
    body?: string,
    url?: string,
    publication_date?: Date | null,
    fullyAnnotated: boolean,
    tone?: string,
    comment?: string,
    edition: Edition,
    metaphors?: MetaphorCase[],
}

export interface MetaphorCase {
    _id?: string,
    location: string,
    char_range: number[],
    text: string,
    comment?: string,
    metaphorModel: MetaphorModel,
    sourceArticleId?: string
}


export interface MetaphorModel {
    _id?: string,
    name: string,   
    comment?: string
}