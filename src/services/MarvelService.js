class MarvelService {

    _apiBase = 'https://marvel-server-zeta.vercel.app/';
    _apikey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';


    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Cloud not fetc ${url}, status: ${res.status}`);
        }
        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=20&offset=0&${this._apikey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apikey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => {

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

}

export default MarvelService;