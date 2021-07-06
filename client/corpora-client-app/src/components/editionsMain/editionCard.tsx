import React, { useState } from 'react'
import { useHistory } from 'react-router';


// Stylings
import styled, { css } from 'styled-components'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

// State
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { handleUpdateEditionPicture } from '../../slices/editionsSlice';
import { Edition } from '../../api/dataModels';



interface EditionCardProps {
    edition: Edition,
    handleSetEditionToBeDeleted: (edition: Edition) => void,
    handleSetEditionToBeUpdated: (edition: Edition) => void
}

interface EditionCardStyledProps {
    isHovered: boolean
}
  

const EditionCardStyled = styled.div<EditionCardStyledProps>`
    position: relative;

    min-height: 100px;
    width: 100%;
    
    @media (min-width: 640px) {
        width: 300px;
    }

    background-color: #FFF;
    border-radius: 4px;
    box-shadow: 0px 0px 14px 3px rgba(165, 148, 249, 0.3);

    padding: 1rem;

    display: grid;
    grid-template-areas: 
    'img title _ _ _'
    'description description description description description';

    cursor: pointer;
    transition: .1s ease-in;

    &:hover {
        transform: scale(1.02);
        box-shadow: 0px 0px 14px 3px rgba(165, 148, 249, 0.4);
    }

    .editionCard__pictureDiv {
        grid-area: img;

        cursor: default;

        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        .editionCard__pictureDiv__img {
            display: block;
            
            width: auto;
            max-width: 32px;
            height: 32px;

            object-fit: contain;
        }

        .editionCard__pictureDiv__placeHolder {
            width: 32px;
            height: 32px;

            background-color: #c0b6b6;
            border-radius: 50%;
        }
    }

    .editionCard__titleDiv {
        grid-area: title;

        font-size: 1.2rem;
        font-weight: 400;

        padding-top: 2px;
    }

    .editionCard__descriptionDiv {
        grid-area: description;
        font-weight: 300;
    }

    .editionCard__button {
        position: absolute;
        width: 32px;
        height: 32px;
        transition: ease-in-out .2s;

        @media (min-width: 1025px) {
            ${
                props => (
                    props.isHovered 
                    ? 
                    css`opacity: 1;`
                    :
                    css`opacity: 0;`
                )
            };
        }
    }
`

const EditionCard: React.FC<EditionCardProps> = ({
    edition,
    handleSetEditionToBeDeleted,
    handleSetEditionToBeUpdated
}) => {
    const dispatch = useAppDispatch();
    const { user: userState } = useAppSelector(state => state)
    
    let history = useHistory()

    const [hovered, setHovered] = useState(false);

    const handleChangeImageAndSubmit = (e: any) => {
        e.stopPropagation();

        const target = e.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];

        if(!file) return 

        if (file.size > 1.5e+7) {
            alert('File too large!')
            return 
        } else {
            let formDataPayload = new FormData();
    
            formDataPayload.append('single_upload', file);
            formDataPayload.append('id', edition._id!!);
    

            dispatch(handleUpdateEditionPicture(formDataPayload));
        }
    }

    return (
        <EditionCardStyled
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => {
                history.push(`/editions/${edition._id}`)
            }}
            isHovered={hovered}
        >
            <div
                className={`editionCard__pictureDiv`}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <label
                    style={{
                        cursor: userState.isAuthenticated ? `pointer` : `initial`
                    }}
                >
                    <input
                        accept="image/*"
                        style={{
                            display: "none"
                        }}
                        type="file"
                        onChange={e => handleChangeImageAndSubmit(e)}
                        disabled={!userState.isAuthenticated}
                    />
                    {
                        edition.pictureURL
                        ?
                        <img
                            className={`editionCard__pictureDiv__img`}
                            src={edition.pictureURL}
                            alt={``}
                        />
                        :
                        <div 
                            className={`editionCard__pictureDiv__placeHolder`}
                        />
                    }
                </label>
            </div>
            <div
                className={`editionCard__titleDiv`}
            >
                {edition.name}
            </div>
            {
                userState.isAuthenticated
                ?
                <>
                    <IconButton
                        style={{
                            right: `3rem`,
                            top: `.5rem`
                        }}
                        color={`primary`}
                        className={`editionCard__button`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSetEditionToBeUpdated(edition);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        style={{
                            right: `.5rem`,
                            top: `.5rem`
                        }}
                        color={`secondary`}
                        className={`editionCard__button`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSetEditionToBeDeleted(edition);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
                :
                null
            }
            <div
                className={`editionCard__descriptionDiv`}
            >
                {edition.description}
            </div>
        </EditionCardStyled>
    )
}


export default EditionCard;