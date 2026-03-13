import axios from "axios";
import React, { useEffect, useState } from "react";

const Contoh = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        // Ambil list pokemon
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=400');
        
        // Fetch detail setiap pokemon untuk dapat gambar
        const pokemonDetails = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const detail = await axios.get(pokemon.url);
            return detail.data;
          })
        );
        
        setData(pokemonDetails);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {data.map((pokemon) => (
        <div key={pokemon.id} className="text-center py-4 px-4 rounded bg-amber-50 shadow-md">
          <img 
            src={pokemon.sprites.front_default} 
            alt={pokemon.name}
            className="w-32 h-32 mx-auto"
          />
          <h3 className="text-xl font-bold capitalize mt-2">{pokemon.name}</h3>
          <p className="text-gray-600">#{pokemon.id}</p>
        </div>
      ))}
    </div>
  );
};

export default Contoh;