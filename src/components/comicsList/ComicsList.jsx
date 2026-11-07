import {useCallback, useEffect, useRef, useState} from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './comicsList.scss';

const PAGE_SIZE = 8;

const ComicsList = () => {
    const {getAllComics} = useMarvelService();
    const [comicsList, setComicsList] = useState([]);
    const [error, setError] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);
    const requestController = useRef(null);

    // Добавляет загруженную страницу и готовит смещение для следующей.
    const onComicsListLoaded = useCallback((newComicsList) => {
        setComicsList(currentList => [...currentList, ...newComicsList]);
        setError(false);
        setInitialLoading(false);
        setNewItemLoading(false);
        setOffset(currentOffset => currentOffset + PAGE_SIZE);
        setComicsEnded(newComicsList.length < PAGE_SIZE);
    }, []);

    // Отмена запроса не отображается как ошибка загрузки.
    const onError = useCallback((requestError) => {
        if (requestError.name !== 'AbortError') {
            setError(true);
            setInitialLoading(false);
            setNewItemLoading(false);
        }
    }, []);

    // При открытии страницы загружается первая подборка комиксов.
    useEffect(() => {
        const controller = new AbortController();
        requestController.current = controller;

        getAllComics(0, controller.signal)
            .then((newComicsList) => {
                if (!controller.signal.aborted) onComicsListLoaded(newComicsList);
            })
            .catch(onError);

        return () => controller.abort();

    }, [onComicsListLoaded, onError]);

    // Загружает следующую страницу и позволяет отменить предыдущий запрос.
    const onRequest = useCallback((requestOffset) => {
        requestController.current?.abort();
        const controller = new AbortController();
        requestController.current = controller;

        setError(false);
        setNewItemLoading(true);
        getAllComics(requestOffset, controller.signal)
            .then((newComicsList) => {
                if (!controller.signal.aborted) onComicsListLoaded(newComicsList);
            })
            .catch(onError);
    }, [getAllComics, onComicsListLoaded, onError]);

    // Отменяет активный запрос при размонтировании списка.
    useEffect(() => () => requestController.current?.abort(), []);

    const items = comicsList.map(comic => (
        <li className="comics__item" key={comic.id}>
            <a href="#">
                <img src={comic.thumbnail} alt={comic.title} className="comics__item-img"/>
                <div className="comics__item-name">{comic.title}</div>
                <div className="comics__item-price">{comic.price}</div>
            </a>
        </li>
    ));

    return (
        <div className="comics__list">
            {error && <ErrorMessage/>}
            {initialLoading && <Spinner/>}
            <ul className="comics__grid">{items}</ul>
            {newItemLoading && <Spinner/>}
            <button
                disabled={newItemLoading}
                style={{display: comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

export default ComicsList;
