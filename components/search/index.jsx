import React, { useState, useEffect, useRef } from "react";
import SelectionArea from "@viselect/vanilla";
import { toast } from "sonner";
import Box from "@/box";
import Scroll from "@/search/scroll/scroll";
import CardSkeleton from "@/search/loader";
import Slash from "@/search/slash";
import { useRouter } from "next/router";
import Form from "@/search/form";
import Input from "@/search/input";
import List from "@/search/list";
import Card from "@/search/card";
import Toaster from "@/search/toaster";
import Drawer from "@/search/drawer";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [symbolsData, setSymbolsData] = useState(null);
  const [numResults, setNumResults] = useState(0);
  const [numSymbols, setNumSymbols] = useState(0);
  const [copiedSymbols, setCopiedSymbols] = useState([]);
  const [isSelected, setSelected] = useState(false);

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
      if (wordRegex.test(category.title)) {
        numResults += category.symbols.length;
        return category.symbols;
      } else {
        const categoryResults = category.symbols.filter((symbol) => {
          const symbolName = symbol.name.replace(/\s+/g, "");
          const symbolWords = symbolName.split(/(?=[A-Z])/).map(escapeRegExp);
          const symbolRegex = new RegExp(
            words.map((word) => `(?=.*${word})`).join("") + ".*",
            "i"
          );
          return symbolRegex.test(symbolWords.join(""));
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
  }, [searchTerm, symbolsData]);

  const handleSlashKey = (event) => {
    if (event.key === "/") {
      event.preventDefault();
      const input = document.getElementById("s");
      input.focus();
    } else if (event.key === "Escape") {
      const input = document.getElementById("s");
      input.blur();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleSlashKey);
    return () => {
      document.removeEventListener("keydown", handleSlashKey);
    };
  }, []);

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

  useEffect(() => {
    const selection = new SelectionArea({
      selectables: [".glyphs > div"],
      boundaries: ["body"],
    })
      .on("start", ({ store, event }) => {
        if (!event.ctrlKey && !event.metaKey) {
          for (const el of store.stored) {
            el.classList.remove("selected");
          }
          selection.clearSelection();
        }
      })
      .on(
        "move",
        ({
          store: {
            changed: { added, removed },
          },
        }) => {
          for (const el of added) {
            el.classList.add("selected");
          }
          for (const el of removed) {
            el.classList.remove("selected");
          }
        }
      )
      .on("stop", ({ store, store: { stored } }) => {
        document.body.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            for (const el of store.stored) {
              el.classList.remove("selected");
            }
            setSelected(false);
            selection.clearSelection();
          }
        });
        const selectedState = selection._selection.stored.length;
        setSelected(selectedState);
        setCopiedSymbols(
          // stored.map((el) => (selectedState ? el.innerHTML : null))
          stored.map((el) =>
            selectedState ? el.getAttribute("data-symbol") : null
          )
        );
      });
    // return () => {
    //   selection.destroy();
    // };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 20000);
  }, []);

  const router = useRouter();

  return (
    <>
      <Form>
        <Input
          id="s"
          placeholder={`${numSymbols ? "e.g arrow →" : "Loading..."}`}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          pattern="[A-Za-z0-9\-]+"
          value={searchTerm}
          onChange={handleChange}
        />
        {/* <button type="button" onClick={() => setSearchTerm("")}>
          ✗
        </button> */}
        <Scroll />
        <Slash />
      </Form>

      <Box
        css={{
          display: "flex",
          fontSize: "0.8rem",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "hsl(260deg 66% 30% / 19%)",
          borderRadius: "20px",
          minHeight: "94px",
          padding: "10px 20px 10px 40px",
          border: "2px solid hsla(0, 0%, 0%, 0.08)",
        }}
      >
        <Box>
          {isSelected && <> {isSelected} Selected /</>} {numSymbols} Glyphs
        </Box>
        {searchTerm && (
          <Box>
            {numResults} result{numResults !== 1 ? "s" : ""}
          </Box>
        )}
        {copiedSymbols && copiedSymbols.length > 0 ? (
          <Drawer>
            {copiedSymbols.map((symbol, index) => (
              <li key={index}>{symbol}</li>
            ))}
            <button onClick={handleClearCopiedSymbols}>✗</button>
          </Drawer>
        ) : null}
      </Box>
      {isLoading || !symbolsData ? (
        <CardSkeleton />
      ) : (
        <List className="glyphs">
          {searchResults.map((item, index) => (
            <Card
              key={index + "searchk"}
              // title={item.name}
              // data-symbol={item.symbol}
              // href={`/${item.symbol}`}
              onClick={(e) => {
                if (e.shiftKey) {
                  e.preventDefault();
                  router.push("/" + item.symbol);
                  // navigate to the specific URL
                } else {
                  // e prevent defualt first to prevent the link from being clicked
                  navigator.clipboard.writeText(item.symbol);
                  handleCopySymbol(item.symbol);
                  toast.custom(() => (
                    <Toaster>
                      Copied <span>{item.symbol}</span> to clipboard!
                    </Toaster>
                  ));
                }
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
