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

    getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=20&offset=0&${this._apikey}`);
    }

     getCharacter = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?${this._apikey}`);
    }


}

export default MarvelService;