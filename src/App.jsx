import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";

//component
import PokemonThumb from "./PokemonThumb";

const App = () => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [loadMore, setLoadMore] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=20"
  );
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [counter, setCounter] = useState(0)

  const getAllPokemons = async () => {
    const res = await fetch(loadMore);
    const data = await res.json();
    setLoadMore(data.next);
    setHasMore(data.next !== null)
    const displayPokemon = async (result) => {
      const pokemonPromise = result.map((pokemon) => {
        return axios.get(pokemon.url);
      });
      const promiseResult = await Promise.all(pokemonPromise);
      console.log(promiseResult);
      setAllPokemons((currentList) => [...currentList, ...promiseResult]);
    };
    displayPokemon(data.results);
  };

  const observer = useRef();
  const lastPokemonElementRef = useCallback((node) => {
    if (observer.current){
      observer.current.disconnect()}
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // getAllPokemons()
        setCounter(counter => counter + 1)
        console.log(counter)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore]);

  useEffect(() => {
    getAllPokemons();
  }, [counter]);

  return (
    <Section className="app-contaner">
      <h1>Pokemon Evolution</h1>
      <div className="pokemon-container">
        <div className="wrapper">
          {allPokemons.map((pokemonStats, index) => {
            if (allPokemons.length !== index + 1) {
              return (
                <div key={pokemonStats.data.id} className="pokemon-card">
                  <small>#0{pokemonStats.data.id}</small>
                  <img src={pokemonStats.data.sprites.other.dream_world.front_default} alt={pokemonStats.data.name} />
                  <div className="detail-wrapper">
                    <h3>{pokemonStats.data.name}</h3>
                    <small>Type: {pokemonStats.data.types[0].type.name}</small>
                  </div>
                </div>
              )
            } else {
              return (
                <div ref={lastPokemonElementRef} key={pokemonStats.data.id} className="pokemon-card">
                  <small>#0{pokemonStats.data.id}</small>
                  <img src={pokemonStats.data.sprites.other.dream_world.front_default} alt={pokemonStats.data.name} />
                  <div className="detail-wrapper">
                    <h3>{pokemonStats.data.name}</h3>
                    <small>Type: {pokemonStats.data.types[0].type.name}</small>
                  </div>
                </div>
              )
            }
          })}
        </div>
        <button onClick={getAllPokemons}>
          Load more
        </button>
      </div>
    </Section>
  );
};

export default App;

const Section = styled.section`
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .pokemon-card {
    cursor: pointer;
    width: 25%;
    height: 250px;
    border: solid 10px #fbd802;
    border-radius: 15px;
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  img {
    width: 50%;
  }
`;
