import './charInfo.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

class CharInfo extends Component{
    state = {
        char: null,
        loading: false,
        error: false
    }
        
    MarvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.setState({
            loading: true,
            error: false
        });

        this.MarvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    replaceDescription = (descr) => {
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

    replaceComics = (comics) => {
        if (comics.length === 0) {
            return 'There are no comics for this character';
        }

        return comics.slice(0, 10).map((item, i) => {
            return (
                <li key={i} className="char__comics-item">
                    {item.name}
                </li>
            )
        })
    }

    render() {
        const {char, loading, error} = this.state;

        const skeleton =char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char} replaceDescription={this.replaceDescription} replaceComics={this.replaceComics}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }

    
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