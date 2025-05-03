import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';


const RandomChar = () =>{

    const [char, setChar] = useState({});

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [])

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (20 - 0) + 0);
        getCharacter(id)
            .then(onCharLoaded)
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View char={char} replaceDescription={replaceDescription}/> : null;
    

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
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

const View = ({char, replaceDescription}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    const isPlaceholder = thumbnail?.includes('image_not_available.jpg');
    return (
        <div className="randomchar__block">
            <img src={thumbnail} 
                 alt="Random character" 
                 className="randomchar__img" 
                 style={{ objectFit: isPlaceholder ? 'contain' : 'cover'}}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {replaceDescription(description)}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;