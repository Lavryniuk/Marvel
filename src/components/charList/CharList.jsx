import './charList.scss';
import { useState, useEffect, useRef } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import AnimatedList from '../animated/AnimatedList';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();
    
    const _componentMounted = useRef(true);

    useEffect(() => {
        if (_componentMounted.current) {
            onRequest(offset, true);
            _componentMounted.current = false;
        }
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);;
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (i) => {
        itemRefs.current.forEach(item => {
            if (item) {
                item.classList.remove('char__item_selected');
            }
        });
    
        const selectedItem = itemRefs.current[i];
        if (selectedItem) {
            selectedItem.classList.add('char__item_selected');
            selectedItem.focus();
        }
    }

    function renderItems(arr) {
        return (
            <AnimatedList
                items={arr}
                itemsClassname='char__item'
                gridClassname='char__grid'
                getItemProps={(item, i) => ({
                    ref: el => itemRefs.current[i] = el,
                    tabIndex: 0,
                    onClick: () => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    },
                    onKeyDown: (e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }
                })}
                renderItem={(item, i) => {
                    let imgStyle = item.thumbnail.includes('image_not_available.jpg')
                        ? { objectFit: 'unset' }
                        : { objectFit: 'cover' };
    
                    return (
                        <>
                            <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                            <div className="char__name">{item.name}</div>
                        </>
                    );
                }}
            />
        );
    }

    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
        >
            <div className="char__list">
                {errorMessage}
                {spinner}
                {items}
                <button className="button button__main button__long"
                        disabled={newItemLoading}
                        style={{'display': charEnded ? 'none' : 'block'}}
                        onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        </motion.div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;