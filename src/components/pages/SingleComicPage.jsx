import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './singleComicPage.scss';

const SingleComicPage = () => {

    const {comicId} = useParams();
    const {getComic} = useMarvelService();

    const [comic, setComic] = useState(null);
    const [failedComicId, setFailedComicId] = useState(null);

    useEffect(() => {

        const controller = new AbortController();

        getComic(comicId, controller.signal)
            .then((comicData) => {
                if (!controller.signal.aborted) {
                    setComic(comicData);
                    setFailedComicId(null);
                }
            })
            .catch((requestError) => {

                if (requestError.name !== 'AbortError') setFailedComicId(comicId);
            });

        return () => controller.abort();
        // getComic создаётся заново сервисом на каждом рендере; запрос запускаем только при смене ID.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comicId]);

    const comicLoaded = comic && String(comic.id) === comicId;
    const error = failedComicId === comicId;
    const loading = !comicLoaded && !error;

    const {
        title,
        thumbnail,
        description,
        pageCount,
        language,
        price
    } = comic ?? {} ;

    return (
        <div className="single-comic">

            {loading && <Spinner/>}
            {error && <ErrorMessage/>}
            {comicLoaded && !error && (
                <>
                    <img src={thumbnail} alt={title} className="single-comic__img"/>
                    <div className="single-comic__info">
                        <h2 className="single-comic__name">{title}</h2>
                        <p className="single-comic__descr">{description}</p>
                        <p className="single-comic__descr">{pageCount}</p>
                        <p className="single-comic__descr">Language: {language}</p>
                        <div className="single-comic__price">{price}</div>
                    </div>
                </>
            )}
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    );
};

export default SingleComicPage;
