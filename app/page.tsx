"use client";

import { useState, useRef, useEffect } from "react";

import { useForm, SubmitHandler } from "react-hook-form";

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

interface IFormInput {
  word: string;
}

const fontOptions = ["Serif", "Sans-Serif", "Mono"];

async function getDefinition(word: string) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  const data = await res.json();
  console.log(data[0]);
  return data[0];
}

function findAudio(results: Result) {
  const found: { audio: string } | undefined = results.phonetics.find(
    (phonetic: { audio?: string }) => phonetic.audio !== ""
  );
  console.log(found);

  return found === undefined ? undefined : (found as { audio: string }).audio;
}



export default function Home() {

  const {
    register,
    handleSubmit,
    formState: { errors },
    getFieldState,
  } = useForm<IFormInput>({
    mode: "onTouched",
  });

  const [results, setresultss] = useState<Result | null | undefined>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDopdownOpen, setIsDopdownOpen] = useState(false);
  const [font, setFont] = useState("Serif");
  // const [randomWords, setRandomWords] = useState<[] | null>(null);

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  // useEffect(() => {
  //   async function fetchRandomWords() {
  //     const res = await fetch(
  //       "https://random-word-api.herokuapp.com/word?number=10"
  //     );
  //     const data = await res.json();
  //     setRandomWords(data)
  //   }
  //  fetchRandomWords();

  // }, [])


  const onSubmit: SubmitHandler<IFormInput> = async (data) =>
    setresultss(await getDefinition(data.word))

  const togglePlayPause = () => {
    const prevState = isPlaying;
    setIsPlaying(!prevState);
    return !prevState
      ? audioPlayer.current?.play()
      : audioPlayer.current?.pause();
  };

  const toggleDropdown = () => {
    setIsDopdownOpen(!isDopdownOpen);
  };

  return (
    <div
      className={`${
        font === "Serif"
          ? "font-serif"
          : `${font === "Sans-Serif" ? "font-sans" : "font-mono"}`
      } flex flex-col bg-white px-5 min-h-screen pb-16 max-w-6xl mx-auto`}
    >
      <header className="flex py-4 items-center gap-2 flex-wrap-reverse">
        <a href="/">
          <IoBook className="text-dark-purple w-12 h-12 lg:w-16 lg:h-16 shrink-0" />
        </a>

        {/* font menu */}
        <div className="font-bold shrink-0" onClick={toggleDropdown}>
          <div className="flex items-center gap-1">
            <button className="text-black">{font}</button>
            {isDopdownOpen ? (
              <IoChevronUpSharp className="text-dark-purple" />
            ) : (
              <IoChevronDownSharp className="text-dark-purple" />
            )}
          </div>
          <ul
            className={`${
              isDopdownOpen ? "block" : "hidden"
            }    absolute top-112 text-black bg-white p-4 rounded-lg shadow-md`}
          >
            {fontOptions.map((option) => {
              return (
                <li
                  key={option}
                  className={`hover:text-dark-purple ${
                    option === "Serif"
                      ? "font-serif"
                      : `${option === "Sans-Serif" ? "font-sans" : "font-mono"}`
                  }`}
                  onClick={() => setFont(option)}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="text-dark-purple text-2xl lg:text-6xl flex-shrink font-bold ml-auto">
          DICTIONARY
        </p>
      </header>
      {/* search bar */}
      <form onSubmit={handleSubmit(onSubmit)} className="group">
        <label
          htmlFor="search-bar"
          className="flex items-center rounded-lg border-solid bg-very-light-gray px-3 has-[:focus]:border has-[:focus]:border-dark-purple has-[:invalid]:border-red-600"
        >
          <input
            type="text"
            className="h-16 w-full bg-very-light-gray placeholder:text-black text-black placeholder:font-bold font-bold focus:placeholder-transparent focus:ring-0 focus:outline-none p-3"
            placeholder="Search for any word..."
            id="search-bar"
            defaultValue=""
            {...register("word", { required: "Please enter a word" })}
          />
          <button type="submit">
            <IoSearchOutline className="text-dark-purple w-6 h-6 m-4" />
          </button>
        </label>
        {errors.word && getFieldState("word").isTouched && (
          <p role="alert" className="text-red-600 mt-3 ml-2 text-sms">
            {errors.word.message}
          </p>
        )}
      </form>

{/* random words gneration */}
      {/* {!results && (
        <div className="flex flex-col gap-4 mt-6">
          <p className="text-black font-bold">..or give one of these a try!</p>
          <ul className="!list-disc list-outside flex flex-col gap-5 ml-5">
            {randomWords &&
              randomWords.map((word) => {
                return (
                  <li key={word} className="marker:text-dark-purple text-gray">
                    <button
                      onClick={async () =>
                        setresultss(await getDefinition(word))
                      }
                    >{word }</button>
                  </li>
                );
              })}
          </ul>
        </div>
      )} */}

      {results && results !== undefined && (
        <>
          <div className="flex py-6 flex-wrap">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold text-black">{results.word}</h1>
              <h2 className="text-dark-purple">{results.phonetic}</h2>
            </div>

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

      {results === undefined && (
        <div className="flex flex-col items-center justify-center h-full grow">
          <p className="text-black text-2xl text-center">
            Sorry, we couldn&apos;t find definitions for the word you were
            looking for
          </p>
          <img
            src="images/tumbleweed-emptystate-lightbg.gif"
            alt="tumble weed rolling"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
