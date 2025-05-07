const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const pokeApi = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";
const pokemonName = document.querySelector("#pokemon-name");
const pokemonId = document.querySelector("#pokemon-id");
const pokemonWeight = document.querySelector("#weight");
const pokemonHeight = document.querySelector("#height");
const pokemonTypes = document.querySelector("#types");
const hp = document.querySelector("#hp");
const attack = document.querySelector("#attack");
const defense = document.querySelector("#defense");
const specialAttack = document.querySelector("#special-attack");
const specialDefense = document.querySelector("#special-defense");
const speed = document.querySelector("#speed");
const pokemonImage = document.querySelector("#sprite");
const imageContainer = document.querySelector(".image-container");

const pokemonStats = [
    hp, attack, defense, specialAttack, specialDefense, speed
];

const pokeTypes = [
    "normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", 
    "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"
];

const getUserInput = (searchInput) => {
return `/${searchInput.value.toLowerCase()}`;
};

const fetchPokemonData = async () => {
    const validUserInput = getUserInput(searchInput)
    try {
        const response = await fetch(`${pokeApi}${validUserInput}`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
        const pokemonData = await response.json();
        const typeNumber = getPokemonTypes(pokemonData);
        showPokemonData(pokemonData, typeNumber);

    }
    catch (error) {
        alert("Pokémon not found");
        console.log(error);
    }
};

const getPokemonTypes = (pokemonData) => {
    const {types} = pokemonData;

    const typesUrl = types.map(url => url["type"]["url"]);
    
    const typeRegex = /(?:\/\d?\d\/)$/;
    const typeNumber = typesUrl.map(url => {
        const urlSnippet = url.match(typeRegex).join("").split("");
        urlSnippet.pop();
        urlSnippet.shift();
        return urlSnippet.join("");
    });
    return typeNumber;
};

const showPokemonData = (pokemonData, typeNumber) => {
    const pokemonTypeUrl = 
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/";
    const {height, id, name, sprites, stats, weight} = pokemonData;
    const {front_default} = sprites;

    pokemonImage.src = front_default;
    imageContainer.style.backgroundColor = `var(--${pokeTypes[typeNumber[0] - 1]})`;
    pokemonId.textContent = id;
    pokemonName.textContent = name.toUpperCase();
    pokemonWeight.textContent = weight;
    pokemonHeight.textContent = height;
    
    typeNumber.forEach(number => {
        pokemonTypes.innerHTML += `<img src="${pokemonTypeUrl}${number}.png" width="100px" height="22px">`
    });
    

    stats.forEach((stat, index) => {
        pokemonStats[index].textContent = stat["base_stat"];
    });
}

const resetPokemonData = () => {
    pokemonTypes.innerHTML = "";
};

searchButton.addEventListener("click", () => {
    resetPokemonData();
    fetchPokemonData();
})