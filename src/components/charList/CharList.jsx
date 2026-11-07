import {useCallback, useEffect, useRef, useState} from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const PAGE_SIZE = 9;

const CharList = ({onCharSelected}) => {
    const {getAllCharacters} = useMarvelService();

    // Состояние списка, пагинации, выбранной карточки и сетевых запросов.
    const [charList, setCharList] = useState([]);
    const [error, setError] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(PAGE_SIZE);
    const [charEnded, setCharEnded] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const itemRefs = useRef([]);
    const requestController = useRef(null);

    const loggerStarted = useRef(false);

    // Добавляет новую страницу к списку и обновляет смещение для следующей загрузки.
    const onCharListLoaded = useCallback( (newCharList) => {



        setCharList(currentList => [...currentList, ...newCharList]);
        setError(false);
        setInitialLoading(false);
        setNewItemLoading(false);
        setOffset(currentOffset => currentOffset + PAGE_SIZE);
        setCharEnded(newCharList.length < PAGE_SIZE);
    }, []);

    // Отменённый запрос не считается ошибкой приложения.
    const onError = useCallback((requestError) => {
        if (requestError.name !== 'AbortError') {
            setError(true);
            setInitialLoading(false);
            setNewItemLoading(false);
        }
    }, []);

    // При первом отображении компонента загружается первая страница персонажей.
    useEffect(() => {
        const controller = new AbortController();
        requestController.current = controller;

        getAllCharacters(PAGE_SIZE, controller.signal)
            .then((newCharList) => {
                if (!controller.signal.aborted) onCharListLoaded(newCharList);
            })
            .catch(onError);

        return () => controller.abort();
    }, [onCharListLoaded, onError]);

    // Загружает следующую страницу и отменяет предыдущий запрос, если он ещё выполняется.
    const onRequest = useCallback((requestOffset) => {
        requestController.current?.abort();
        const controller = new AbortController();
        requestController.current = controller;

        setError(false);
        setNewItemLoading(true);
        getAllCharacters(requestOffset, controller.signal)
            .then((newCharList) => {
                if (!controller.signal.aborted) onCharListLoaded(newCharList);
            })
            .catch(onError);
    }, [getAllCharacters, onCharListLoaded, onError]);

    // Отменяет активный запрос при размонтировании компонента.
    useEffect(() => () => requestController.current?.abort(), []);

    // После выбора карточки переводит на неё клавиатурный фокус.
    useEffect(() => {
        if (selectedItem !== null) itemRefs.current[selectedItem]?.focus();
    }, [selectedItem]);

    // Создаёт карточки и связывает выбор мышью или клавиатурой с родительским компонентом.
    const items = charList.map((item, index) => {
        const selectItem = () => {
            onCharSelected(item.id);
            setSelectedItem(index);
        };

        return (
            <li
                className={index === selectedItem ? 'char__item char__item_selected' : 'char__item'}
                tabIndex={0}
                ref={element => { itemRefs.current[index] = element; }}
                key={item.id}
                onClick={selectItem}
                onKeyDown={event => {
                    if (event.key === ' ' || event.key === 'Enter') {
                        event.preventDefault();
                        selectItem();
                    }
                }}>
                <img src={item.thumbnail} alt={item.name} />
                <div className="char__name">{item.name}</div>
            </li>
        );
    });

    useEffect(() => {
        if (!initialLoading || loggerStarted.current) return;
        loggerStarted.current = true;

        import('./someFunc.jsx')
            .then(logger => logger.default())
            .catch(error => console.error('Не удалось загрузить модуль:', error));
    }, [initialLoading]);

    return (
        <div className="char__list">
            {error && <ErrorMessage/>}
            {initialLoading && <Spinner/>}
            <ul className="char__grid">{items}</ul>
            {newItemLoading && <Spinner/>}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{display: charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

export default CharList;
