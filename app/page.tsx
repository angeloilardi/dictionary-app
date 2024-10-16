"use client";

import { useState, useRef, SetStateAction } from "react";

import {
  IoSearchOutline,
  IoPlay,
  IoPause,
  IoBook,
  IoChevronDownSharp,
  IoChevronUpSharp,
} from "react-icons/io5";

type Result = {
  phonetics: [];
  definitions: [];
  sourceUrls: string[];
  word: string;
  phonetic: string;
  meanings: [];
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
  const found: {audio:string} | undefined = results.phonetics.find(
    (phonetic: { audio?: string }) => phonetic.audio !== ""
  );
  console.log(found);

  return found === undefined ? undefined : (found as { audio: string }).audio;

}

export default function Home() {
  const [word, setWord] = useState("");
  const [results, setresultss] = useState<Result | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDopdownOpen, setIsDopdownOpen] = useState(false);
  const [font, setFont] = useState('Serif')

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
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

  const toggleDropdown = () => {
    setIsDopdownOpen(!isDopdownOpen)
  }

  return (
    <div className="flex flex-col bg-white px-5 min-h-screen pb-16 max-w-6xl mx-auto">
      <header className="flex py-4 justify-between">
        <IoBook className="text-dark-purple w-16 h-16" />

        {/* font menu */}
        <div
          className="flex flex-col items-center gap-1"
          onClick={toggleDropdown}
        >
          <button className="text-black">{font}</button>
          {isDopdownOpen ? (
            <IoChevronUpSharp className="text-dark-purple" />
          ) : (
            <IoChevronDownSharp className="text-dark-purple" />
          )}
          <ul
            className={`${isDopdownOpen ? 'block' : 'hidden'}    absolute top-20 text-black bg-white p-4 rounded-lg shadow-md`}
          >
            <li>Serif</li>
            <li>SansSerif</li>
            <li>Mono</li>
          </ul>
        </div>

        <p className="text-dark-purple text-6xl">DICTIONARY</p>
      </header>
      {/* search bar */}
      <form action={handleSubmit}>
        <label
          htmlFor="search-bar"
          className="flex items-center rounded-lg border-solid bg-very-light-gray px-3 has-[:focus]:border has-[:focus]:border-dark-purple"
        >
          <input
            type="text"
            className="h-16 w-full bg-very-light-gray placeholder:text-black text-black placeholder:font-bold font-bold focus:placeholder-transparent focus:ring-0 focus:outline-none p-3"
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
              <h1 className="text-3xl font-bold text-black">{results.word}</h1>
              <h2 className="text-dark-purple">{results.phonetic}</h2>
            </div>

            {/* auio player */}
            {findAudio(results) !== undefined && (
              <button
                className="ml-auto rounded-full w-12 h-12 bg-light-purple flex items-center justify-center"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <IoPause className="text-dark-purple w-10" />
                ) : (
                  <IoPlay className="text-dark-purple w-10" />
                )}
                <audio
                  ref={audioPlayer}
                  src={findAudio(results)}
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                ></audio>
              </button>
            )}
          </div>

          {/* definitions */}
          <div className="flex flex-col gap-8 py-9">
            {results.meanings.map(
              (meaning: { definitions: []; partOfSpeech: string }, index) => {
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
                      {definitions.map(
                        (definition: {
                          definition: string;
                          example: string;
                        }) => {
                          {
                            return (
                              <li className="marker:text-dark-purple text-gray">
                                {definition.definition}
                                {definition.example && (
                                  <p className="text-light-gray marker:text-transparent">
                                    &quot;{definition.example}&quot;
                                  </p>
                                )}
                              </li>
                            );
                          }
                        }
                      )}
                    </ul>
                  </>
                );
              }
            )}
          </div>

          <hr className="w-full text-light-gray" />
          {results.sourceUrls && (
            <>
              <p className="text-light-gray text-sm mt-6">Source</p>
              <a
                href={results.sourceUrls[0]}
                target="_blank"
                className="underline text-gray"
              >
                {results.sourceUrls[0]}
              </a>
            </>
          )}
        </>
      )}
    </div>
  );
}
