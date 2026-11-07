import {useHttp} from "../hooks/http.hook.js";


const  useMarvelService = ()=> {

    const {loading, request,error} = useHttp()

  const  _apiBase = 'https://marvel-server-zeta.vercel.app/';
  const  _apikey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
  const   _baseOffest = 9;


  // const  getResource = async (url,signal) => {
  //       let res = await fetch(url,{ signal });
  //
  //       if (!res.ok) {
  //           throw new Error(`Cloud not fetc ${url}, status: ${res.status}`);
  //       }
  //       return await res.json();
  //   }

  const  getAllCharacters = async (offset = _baseOffest, signal) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apikey}`, 'GET', null, undefined, signal);
        return res.data.results.map(_transformCharacter);
    }

    const getAllComics = async (offset = 0, signal) => {
        const res = await request(
            `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apikey}`,
            'GET',
            null,
            undefined,
            signal
        );
        return res.data.results.map(_transformComics);
    };

    const getComic = async (id, signal) => {
        const res = await request(
            `${_apiBase}comics/${id}?${_apikey}`,
            'GET',
            null,
            undefined,
            signal
        );
        return _transformComics(res.data.results[0]);
    };

   const getCharacter = async (id, signal) => {
        const res = await request(`${_apiBase}characters/${id}?${_apikey}`, 'GET', null, undefined, signal);
        return _transformCharacter(res.data.results[0]);
    }

   const _transformCharacter = (char) => {

        const maxLength = 150;
        const description = char.description == null
            ? 'The description is missing.'
            : char.description.length > maxLength
                ? char.description.slice(0, maxLength) + '...'
                : char.description;



        return {
            id:char.id,
            name: char.name,
            description: description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || "There is no description",
            pageCount: comics.pageCount
                ? `${comics.pageCount} p.`
                : "No information about the number of pages",
            thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
            language: comics.textObjects?.[0]?.language || "en-us",
            // optional chaining operator
            price: comics.prices?.[0]?.price
                ? `${comics.prices[0].price}$`
                : "not available",
        };
    };

    return {loading,error,getAllCharacters,getAllComics,getComic,getCharacter};

}

export default useMarvelService;
