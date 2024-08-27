import { useState, useRef, useContext, useEffect } from "react";
import baseEndpoint from "../utils/api";
import "./searchBar.css";
import { FilterContext } from "../contexts/FilterContext";
import { debounce } from "lodash";
import DropdownListItem from "./DropdownListItem";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const { title, filterDispatch } = useContext(FilterContext);
    const [searchTerm, setSearchTerm] = useState(title);
    const [searchData, setSearchData] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [navigationMode, setNavigationMode] = useState("keyboard");
    const [resultCount, setResultCount] = useState(null);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        setSearchTerm(title);
    }, [title]);

    const fetchSearchData = async (term) => {
        if (term.length < 2) {
            setSearchData([]);
            return;
        }

        try {
            const searchResults = await baseEndpoint.get(
                `/biblioteka/api/literatura?title=${term}&limit=5`
            );
            setResultCount(searchResults.data.count);
            setSearchData(searchResults.data.results);
            setShowResults(true);
        } catch (error) {
            console.error("Error fetching search data", error);
        }
    };

    const debouncedFetchSearchData = debounce(fetchSearchData, 300);

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length >= 2) {
            debouncedFetchSearchData(e.target.value);
        } else {
            setShowResults(false);
            setSearchData([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowResults(false);
        filterDispatch({
            type: "UPDATE_TITLE",
            payload: { searchTerm },
        });
    };

    const handleKeyDown = (e) => {
        if (showResults && searchData.length > 0) {
            setNavigationMode("keyboard");

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setFocusedIndex((prevIndex) =>
                    prevIndex < searchData.length - 1 ? prevIndex + 1 : 0
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocusedIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : searchData.length - 1
                );
            } else if (e.key === "Enter" && focusedIndex >= 0) {
                e.preventDefault();
                const selectedItem = searchData[focusedIndex];
                filterDispatch({
                    type: "UPDATE_TITLE",
                    payload: { searchTerm: "" },
                });
                navigate(`/${encodeURI(selectedItem.title)}`);
            } else if (e.key === "Escape") {
                setShowResults(false);
                setFocusedIndex(-1);
            }
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (searchTerm.length >= 2 && searchData.length > 0) {
            setShowResults(true);
        }
    };

    const handleBlur = (e) => {
        if (
            dropdownRef.current &&
            dropdownRef.current.contains(e.relatedTarget)
        ) {
            return;
        }
        setIsFocused(false);
        setFocusedIndex(-1);
        setShowResults(false);
    };

    const handleItemClick = (item) => {
        filterDispatch({
            type: "UPDATE_TITLE",
            payload: { searchTerm: "" },
        });
        navigate(`/${encodeURI(item.title)}`);
    };

    const handleItemHover = (index) => {
        setNavigationMode("mouse");
        setFocusedIndex(index);
    };

    useEffect(() => {
        if (dropdownRef.current && focusedIndex >= 0) {
            const focusedItem = dropdownRef.current.querySelector(
                `li:nth-child(${focusedIndex + 1})`
            );
            if (focusedItem) {
                focusedItem.scrollIntoView({ block: "nearest" });
            }
        }
    }, [focusedIndex]);

    useEffect(() => {
        if (isFocused && searchTerm.length >= 2 && searchData.length > 0) {
            setShowResults(true);
        }
    }, [isFocused, searchTerm, searchData]);

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className={`search-input-button-wrapper ${
                    isFocused ? "focused" : ""
                }`}
            >
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Pretraži naslove"
                    ref={inputRef}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="search-input"
                />
                <button
                    type="submit"
                    className="search-button"
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <img
                        src={require("../assets/find.png")}
                        alt=""
                        width={20}
                        style={{ margin: 0, padding: 0 }}
                    />
                </button>
            </form>
            {isFocused && showResults && searchData.length > 0 && (
                <ul
                    className="dropdown-list populated"
                    ref={dropdownRef}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {searchData.map((item, index) => (
                        <DropdownListItem
                            key={item.id}
                            publication={item}
                            isFocused={
                                navigationMode === "keyboard"
                                    ? focusedIndex === index
                                    : navigationMode === "mouse" &&
                                      focusedIndex === index
                            }
                            onClick={() => handleItemClick(item)}
                            onMouseEnter={() => handleItemHover(index)}
                        />
                    ))}
                    {resultCount > 5 ? (
                        <li
                            className="dropdown-list-item dropdown-load-extra"
                            onClick={handleSubmit}
                        >
                            <span className="dropdown-load-extra-link">
                                Prikaži sve rezultate za "{searchTerm}"
                            </span>
                        </li>
                    ) : (
                        <li className="dropdown-list-item dropdown-load-extra dropdown-load-extra-info">
                            <span>
                                Učitani su svi rezultati za "{searchTerm}"
                            </span>
                        </li>
                    )}
                    {/* <li className="dropdown-list-item dropdown-load-extra">
                        {resultCount > 5 ? (
                            <span className="dropdown-load-extra-link" onClick={handleSubmit}>
                                Prikaži sve rezultate za "{searchTerm}"
                            </span>
                        ) : (
                            <span className="dropdown-load-extra-info">
                                Učitani su svi rezultati za "{searchTerm}"
                            </span>
                        )}
                    </li> */}
                </ul>
            )}
        </>
    );
};

export default SearchBar;
