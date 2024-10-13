'use client'

import { useState } from "react";

import { IoSearchOutline } from "react-icons/io5";

// import { getDefinition } from './actions'

async function getDefinition(word:string) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  const data = await res.json();
  console.log(data);
  return data[0];
}


export default function Home() {
  const [word, setWord] = useState('');
  const [results, setresultss] = useState(null);

  const handleInputChange = (event) => {
    setWord(event.target.value);
  };
  
  const handleSubmit = async () => {
    setresultss(await getDefinition(word));
  };

  return (
    <div className="flex flex-col bg-white">
      <form action={handleSubmit}>
        <label
          htmlFor="search-bar"
          className="flex items-center rounded-lg border-solid bg-very-light-gray"
        >
          <input
            type="text"
            className="h-16 w-full bg-very-light-gray"
            placeholder="Search for any word..."
            id="search-bar"
            name="word"
            value={word}
            onChange={handleInputChange}
          />
          <button type="submit">
            <IoSearchOutline className="text-dark-purple w-6 h-6 m-4" />
          </button>
        </label>
      </form>

      {results && (
        <div className="flex flex-col gap-3">
          <h1>{results.word}</h1>
          <h2>{results.phonetic}</h2>
          {
            results.meanings.map(meaning => {
              const definitions = meaning.definitions;
              console.log(definitions);
              return (
                <div>
                  <div className="flex items-center gap-4">
                    <h3 className="text-black italic">
                      {meaning.partOfSpeech}
                    </h3>
                    <hr className="w-full text-light-gray" />
                  </div>
                  <h4 className="text-light-gray">Meaning</h4>
                  <ul className="!list-disc list-inside">
                    {definitions.map((definition) => {
                      {
                        return (
                          <li className="marker:text-dark-purple">
                            {definition.definition}
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              );  
            })
          }
          
        </div>
      )}
    </div>
  );
}
