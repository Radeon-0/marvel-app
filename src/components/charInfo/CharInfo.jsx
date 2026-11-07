import {useEffect, useState} from 'react';
import './charInfo.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';

const CharInfo = ({charId}) => {
    const {loading, getCharacter} = useMarvelService();
    const [char, setChar] = useState(null);
    const [requestError, setRequestError] = useState(false);

    useEffect(() => {
        if (!charId) return;

        const controller = new AbortController();
        getCharacter(charId, controller.signal)
            .then((character) => {
                if (!controller.signal.aborted) {
                    setChar(character);
                    setRequestError(false);
                }
            })
            .catch((error) => {
                if (error.name !== 'AbortError') setRequestError(true);
            });

        return () => controller.abort();
    }, [charId]);

    const skeleton = char || loading || requestError ? null : <Skeleton/>;
    const errorMessage = requestError ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || requestError || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    );
};

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name}/>
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
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.map((item, index) => (
                    <li key={index} className="char__comics-item">{item}</li>
                ))}
            </ul>
        </>
    );
};

export default CharInfo;
