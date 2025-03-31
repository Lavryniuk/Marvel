

class MarvelService {
    getResourses = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    };

    getAllCharacters = () => {
        return this.getResourses(`https://gateway.marvel.com:443/v1/public/characters?limit=9&offset=210&apikey=18c01e089289b2aca9f1ad1ae16beac9
        `);
    }
}

export default MarvelService;