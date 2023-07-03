import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import SelectionArea from "@viselect/vanilla";
import { toast } from "sonner";
import Box from "@/box";
import Scroll from "@/search/scroll/scroll";
import CardSkeleton from "@/search/loader";
import Slash from "@/search/slash";
import Form from "@/search/form";
import Input from "@/search/input";
import List from "@/search/list";
import Card from "@/search/card";
import Toaster from "@/search/toaster";
import Drawer from "@/search/drawer";
import Clear from "@/search/clear";
import Filter from "@/search/filter";
import Action from "@/search/action";
import Sidebar from "@/search/sidebar";
import Carbon from "u/ads";

import {
  toURL,
  toUnicode,
  levenshteinDistance,
  handleClearCopiedSymbols,
} from "@/search/utils";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [symbolsData, setSymbolsData] = useState(null);
  const [numResults, setNumResults] = useState(0);
  const [numSymbols, setNumSymbols] = useState(0);
  const [copiedSymbols, setCopiedSymbols] = useState([]);
  const [isSelected, setSelected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGlyph, setSelectedGlyph] = useState(null);
  const [isContentVisible, setIsContentVisible] = useState(false);

  const router = useRouter();

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => {
        setSymbolsData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  useEffect(() => {
    if (!symbolsData) return;
    setIsLoading(true);
    let numResults = 0;
    const escapedSearchTerm = escapeRegExp(searchTerm);
    const words = escapedSearchTerm.split(/\s+/).map(escapeRegExp);
    const wordRegex = new RegExp(words.join(".*"), "i");
    const results = symbolsData.categories.category.flatMap((category) => {
      if (selectedCategory && selectedCategory !== category) {
        return [];
      } else if (wordRegex.test(category.title)) {
        numResults += category.symbols.length;
        return category.symbols;
      } else {
        const categoryResults = category.symbols.filter((symbol) => {
          const symbolName =
            typeof symbol.name === "string"
              ? symbol.name.replace(/\s+/g, "")
              : "";
          const symbolWords = symbolName.split(/(?=[A-Z])/).map(escapeRegExp);
          const symbolRegex = new RegExp(
            words.map((word) => `(?=.*${word})`).join("") + ".*",
            "i"
          );
          if (symbol.symbol === searchTerm) {
            return true;
          }
          const distance = levenshteinDistance(searchTerm, symbolName);
          return distance <= 4 || symbolRegex.test(symbolWords.join(""));

          // return symbolRegex.test(symbolWords.join(""));
        });
        numResults += categoryResults.length;
        return categoryResults;
      }
    });

    const numSymbols = symbolsData.categories.category.reduce(
      (acc, category) => acc + category.symbols.length,
      0
    );

    setSearchResults(results);
    setNumResults(numResults);
    setNumSymbols(numSymbols);
    setIsLoading(false);
  }, [searchTerm, symbolsData, selectedCategory]);

  useEffect(() => {
    const handleSlashKey = (event) => {
      if (
        event.key === "/" ||
        ((event.keyCode === 191 || event.keyCode === 75) &&
          (event.metaKey || event.ctrlKey))
      ) {
        event.preventDefault();
        const input = document.getElementById("s");
        input.focus();
      } else if (event.key === "Escape") {
        const input = document.getElementById("s");
        searchTerm && setSearchTerm("");
        copiedSymbols && setCopiedSymbols("");
        selectedCategory && setSelectedCategory("");
        input.blur();
        setSelectedGlyph(null);
        setIsContentVisible(false);
      }
    };

    const handleArrowKey = (event) => {
      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        (isContentVisible &&
          (event.key === "spacebar" ||
            event.key === "Enter" ||
            event.key === "Tab"))
      ) {
        event.preventDefault();
        const currentIndex = searchResults.findIndex(
          (item) => item.symbol === selectedGlyph
        );
        const nextIndex =
          event.key === "ArrowLeft" ? currentIndex - 1 : currentIndex + 1;
        const nextGlyph = searchResults[nextIndex];

        if (nextGlyph) {
          setSelectedGlyph(nextGlyph.symbol);
          setIsContentVisible(true);
        }
      } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        const currentCategoryIndex = symbolsData.categories.category.findIndex(
          (category) => category.title === selectedCategory?.title
        );
        const nextCategoryIndex =
          event.key === "ArrowUp"
            ? currentCategoryIndex - 1
            : currentCategoryIndex + 1;
        const nextCategory = symbolsData.categories.category[nextCategoryIndex];

        if (nextCategory) {
          setSelectedCategory(nextCategory);
          // setSelectedCategory(nextCategory);
          // setSelectedGlyph(null);
          // setIsContentVisible(false);
          setSelectedGlyph(nextCategory.symbols[0]?.symbol);
        }
      }
    };

    document.addEventListener("keydown", handleSlashKey);
    document.addEventListener("keydown", handleArrowKey);
    return () => {
      document.removeEventListener("keydown", handleSlashKey);
      document.removeEventListener("keydown", handleArrowKey);
    };
  }, [
    searchTerm,
    copiedSymbols,
    selectedCategory,
    selectedGlyph,
    searchResults,
    isContentVisible,
  ]);

  const handleCopySymbol = (symbol) => {
    setCopiedSymbols((prevCopiedSymbols) => [
      symbol,
      ...prevCopiedSymbols.slice(0, 9),
    ]);
  };

  useEffect(() => {
    localStorage.setItem("copiedSymbols", JSON.stringify(copiedSymbols));
  }, [copiedSymbols]);

  useEffect(() => {
    const storedCopiedSymbols =
      JSON.parse(localStorage.getItem("copiedSymbols")) || [];
    setCopiedSymbols(storedCopiedSymbols);

    const handleUnload = () => {
      localStorage.removeItem("copiedSymbols");
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const handleClearCopiedSymbols = () => {
    localStorage.removeItem("copiedSymbols");
    setCopiedSymbols([]);
  };

  function copyToClipboardSymbol(symbol) {
    navigator.clipboard.writeText(symbol);
    handleCopySymbol(symbol);
    toast.custom(() => (
      <Toaster>
        <span>{symbol}</span> Copied to clipboard!
      </Toaster>
    ));
  }

  function copyToClipboardUnicode(symbol) {
    navigator.clipboard.writeText(toUnicode(symbol));
    handleCopySymbol(symbol);
    toast.custom(() => (
      <Toaster>
        Copied <span>{toUnicode(symbol)}</span> for <span>{symbol}</span> to
        clipboard!
      </Toaster>
    ));
  }

  function handleClick(e, { symbol, name }) {
    if (e.altKey) {
      e.preventDefault();
      copyToClipboardUnicode(symbol);
    } else if (e.shiftKey) {
      e.preventDefault();
      copyToClipboardSymbol(symbol);
    } else {
      e.preventDefault();
      setSelectedGlyph(symbol);
      setIsContentVisible(true);

      // Navigate to the dynamic route for the clicked card
      // const url = `${toURL(name)}`; // Generate the URL using toURL function and the name property
      // router.push(`/[name]`, `/${name}`);
    }
  }

  function toUni(char) {
    return `U+${char
      .charCodeAt(0)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0")}`;
  }

  function toHtml(char) {
    return `&#${char.toString().charCodeAt(0)};`;
  }

  function toCSS(char) {
    const codePoint = char.toString().codePointAt(0).toString(16);
    return `\\${codePoint} `;
  }

  function charToUrlEscapeCode(char) {
    return encodeURIComponent(char.toString());
  }

  const currentGlyph = searchResults.find(
    (item) => item.symbol === selectedGlyph
  )?.name;

  function getCategoryOfSelectedGlyph() {
    if (symbolsData && selectedGlyph) {
      for (const category of symbolsData.categories.category) {
        const matchingSymbol = category.symbols.find(
          (symbol) => symbol.symbol === selectedGlyph
        );
        if (matchingSymbol) {
          return category.title;
        }
      }
    }
    return "";
  }

  return (
    <>
      <Form>
        <Input
          id="s"
          placeholder="e.g arrow →"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          pattern="[A-Za-z0-9\-]+"
          value={searchTerm}
          onChange={handleChange}
        />
        <Clear
          type="reset"
          onClick={() => setSearchTerm("") && setSelected(" ")}
        />
        <Scroll />
        <Slash />
        {!isLoading && symbolsData ? (
          <Filter
            value={selectedCategory ? selectedCategory.title : ""}
            onChange={(event) => {
              const title = event.target.value;
              setSelectedCategory(
                symbolsData.categories.category.find(
                  (category) => category.title === title
                )
              );
            }}
          >
            <option value="">All categories</option>
            {symbolsData.categories.category.map((category) => (
              <option key={category.title} value={category.title}>
                {`${category.title} (${category.symbols.length})`}
              </option>
            ))}
          </Filter>
        ) : (
          <Filter>
            <option value="">All categories</option>
          </Filter>
        )}
      </Form>
      <Box
        css={{
          display: "flex",
          fontSize: "0.8rem",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "58px",
          paddingLeft: "28px",
        }}
      >
        <Action
          isLoading={isLoading}
          isSelected={isSelected}
          searchTerm={searchTerm}
          numResults={numResults}
          numSymbols={numSymbols}
        />

        {copiedSymbols && copiedSymbols.length > 0 ? (
          <Drawer>
            {copiedSymbols.map((symbol, index) => (
              <li key={index}>{symbol}</li>
            ))}
            <button onClick={() => handleClearCopiedSymbols("")}>✗</button>
          </Drawer>
        ) : null}
      </Box>
      {/* 
      {isContentVisible && ( )}*/}
      <Box
        css={{
          display: "flex",
          position: "fixed",
          width: "100vw",
          height: "100vh",
          // inset: "0",
          top: "0",
          zIndex: "2999",
          backdropFilter: "blur(10px)",
          opacity: isContentVisible ? "1" : "0",
          visibility: isContentVisible ? "visible" : "hidden",
          // transform: isContentVisible ? "translate(100%, 0)" : "0",
          right: isContentVisible ? "0" : "-100vw",
          transition: "all 480ms",
          cursor: "zoom-out",
          // background: `radial-gradient(circle at 100% 0%, oklch(0.55 0.27 258.93 / 0.64) 0%, oklch(0.35 0.5 313) 110%)`,
          "-webkit-mask-image": `linear-gradient(
              to left,
              hsla(300, 90%, 52%, 1) 40%,
              hsla(300, 90%, 52%, 0)
            )`,
          "mask-image": `linear-gradient(
              to left,
              hsla(300, 90%, 52%, 1) 40%,
              hsla(300, 90%, 52%, 0)
            )`,
        }}
        onClick={(e) => {
          setSelectedGlyph(null);
          setIsContentVisible(false);
        }}
      ></Box>

      <Sidebar
        css={{
          opacity: isContentVisible ? "1" : "0",
          pointerEvents: isContentVisible ? "auto" : "none",
          transform: isContentVisible
            ? "translate3d(0, 0, 0)"
            : "translate3d(10px, 0, 0)",
        }}
      >
        <Box
          css={{
            // display: "flex",
            // flexDirection: "column",
            // width: "100%",
            // height: "240px",
            // alignItems: "center",
            // justifyContent: "center",
            borderBottom: "1px solid hsla(262, 71%, 100%, 0.2)",
            padding: "40px",
            lineHeight: "1",
            fontSize: "18px",

            ".main": {
              fontSize: "140px",
            },
          }}
        >
          <h2>{currentGlyph}</h2>
          {selectedGlyph && <div>{getCategoryOfSelectedGlyph()}</div>}
          <br />
          <span className="main">{selectedGlyph}</span>
          <div>unicode</div>
          <div>copy</div>
          <div>png</div>
          <div>svg</div>
          <div>pattern</div>
          {selectedGlyph && (
            <>
              {toUni(selectedGlyph)} <br />
              {toHtml(selectedGlyph)} <br />
              {toCSS(selectedGlyph)} <br />
              {charToUrlEscapeCode(selectedGlyph)} <br />
            </>
          )}
          <Carbon />
        </Box>
      </Sidebar>
      {isLoading || !symbolsData ? (
        <CardSkeleton />
      ) : (
        <List className="glyphs">
          {searchResults.map((item, index) => (
            <Card
              key={index + "searchk"}
              href={`/${toURL(item.name)}`}
              onClick={(e) => handleClick(e, item)}
              onMouseEnter={(e) => {
                e.currentTarget.setAttribute("title", item.name);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.removeAttribute("title", item.name);
              }}
            >
              <span>{item.symbol}</span>
            </Card>
          ))}
        </List>
      )}
    </>
  );
}
