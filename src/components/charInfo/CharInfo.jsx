import './charInfo.scss';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import { Link } from 'react-router-dom';

const CharInfo = (props) => {
   
    const [char, setChar] = useState(null);
        
    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const skeleton =char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;

    const content = 
        !(loading || error || !char) ? (
            <View 
                char={char} 
                replaceDescription={replaceDescription} 
                replaceComics={replaceComics}
            />) 
        : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const replaceComics = (comics) => {
    if (comics.length === 0) {
        return 'There are no comics available for this character';
    }

    return comics.slice(0, 10).map((item, i) => {
        const comicId = item.resourceURI?.split('/').pop();
        
        return (
            <li key={i} className="char__comics-item">
                <Link to={`/comics/${comicId}`}>
                    {item.name}
                </Link>
            </li>
        )
    })
}

const replaceDescription = (descr) => {
    if (!descr) {
        const noDescr = `No description available.`;
        return noDescr;
    }
    
    if (descr.length > 120) {
        const words = descr.substring(0, 120).split(' ');
        words.pop();
        return words.join(' ') + '...';
    }

    return descr;
}

const View = ({char, replaceDescription, replaceComics}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    const isPlaceholder = thumbnail.includes('image_not_available.jpg');

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} 
                     alt={name} 
                     style={{ objectFit: isPlaceholder ? 'contain' : 'cover'}}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {replaceDescription(description)}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {replaceComics(comics)}
            </ul>
        </>
    )
}

export default CharInfo;