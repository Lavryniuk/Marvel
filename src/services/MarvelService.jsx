

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=18c01e089289b2aca9f1ad1ae16beac9';
    getResourses = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    };

    getAllCharacters = () => {
        return this.getResourses(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }

    getCharacter = (id) => {
        return this.getResourses(`${this._apiBase}characters/${id}?${this._apiKey}`);
    }
}

export default MarvelService;