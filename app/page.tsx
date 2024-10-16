"use client";

import { useState, useRef, SetStateAction } from "react";

import { IoSearchOutline, IoPlay, IoPause } from "react-icons/io5";

// import { getDefinition } from './actions'

type Result = {
  phonetics: [];
  definitions: [];
  source: string;
  word: string;
  phonetic: string;
  meanings: []
};

async function getDefinition(word: string) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  const data = await res.json();
  // console.log(data);
  return data[0];
}

function findAudio(results: Result) {
  const found:[{audio:string}] | undefined = results.phonetics.find((phonetic: {audio?:string}) => phonetic.audio !== "");
  return found ? found.audio : undefined;
}

export default function Home() {
  const [word, setWord] = useState("");
  const [results, setresultss] = useState<Result | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioPlayer = useRef<HTMLAudioElement|null>(null);

  const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setWord(event.target.value);
  };

  const handleSubmit = async () => {
    setresultss(await getDefinition(word));
  };

  const togglePlayPause = () => {
    const prevState = isPlaying;
    setIsPlaying(!prevState);
    return !prevState
      ? audioPlayer.current?.play()
      : audioPlayer.current?.pause();
  };

  return (
    <div className="flex flex-col bg-white px-5 min-h-screen">
      {/* search bar */}
      <form action={handleSubmit}>
        <label
          htmlFor="search-bar"
          className="flex items-center rounded-lg border-solid bg-very-light-gray px-3"
        >
          <input
            type="text"
            className="h-16 w-full bg-very-light-gray placeholder:text-black placeholder:font-bold font-bold"
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
        <>
          <div className="flex py-6 flex-wrap">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{results.word}</h1>
              <h2 className="text-dark-purple">{results.phonetic}</h2>
            </div>
            <button
              className="ml-auto rounded-full w-12 h-12 bg-light-purple flex items-center justify-center"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <IoPause className="text-dark-purple w-10" />
              ) : (
                <IoPlay className="text-dark-purple w-10" />
              )}

              {findAudio(results) !== undefined && (
                <audio
                  ref={audioPlayer}
                  src={findAudio(results)}
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                ></audio>
              )}
            </button>
          </div>
          <div className="flex flex-col gap-8">
            {results.meanings.map((meaning: {definitions: [], partOfSpeech:string}, index) => {
              const definitions = meaning.definitions;
              return (
                <>
                  <div key={index} className="flex items-center gap-5">
                    <h3 className="text-black italic font-bold">
                      {meaning.partOfSpeech}
                    </h3>
                    <hr className="w-full text-light-gray" />
                  </div>
                  <h4 className="text-light-gray">Meaning</h4>
                  <ul className="!list-disc list-outside flex flex-col gap-5 ml-5">
                    {definitions.map((definition:{definition:string, example:string}) => {
                      {
                        return (
                          <li className="marker:text-dark-purple">
                            {definition.definition}
                            {definition.example && (
                              <p className="text-light-gray marker:text-transparent">
                                &quot;{definition.example}&quot;
                              </p>
                            )}
                          </li>
                        );
                      }
                    })}
                  </ul>
                </>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
