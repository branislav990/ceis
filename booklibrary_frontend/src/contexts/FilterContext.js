import { createContext, useReducer } from "react";
import { filterReducer } from "../reducers/filterReducer";

export const FilterContext = createContext();

const initialState = {
    researchSubjects: [],
    categories: [],
    languages: [],
    publicationYearsRange: null,
    publicationYearsDefault: null,
    publishers: [],
    title: "",
    author: {
        firstName: "",
        lastName: "",
    },
    sorting: { label: "Redosledu dodavanja", queryParam: "" },
    sortingDirection: "ascending",
};

const FilterContextProvider = ({ children }) => {
    const [filterState, filterDispatch] = useReducer(
        filterReducer,
        initialState
    );

    const {
        researchSubjects,
        categories,
        languages,
        publicationYearsRange,
        publicationYearsDefault,
        publishers,
        title,
        author,
        sorting,
        sortingDirection,
    } = filterState;

    return (
        <FilterContext.Provider
            value={{
                researchSubjects,
                categories,
                languages,
                publicationYearsRange,
                publicationYearsDefault,
                publishers,
                title,
                author,
                sorting,
                sortingDirection,
                filterDispatch,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};

export default FilterContextProvider;
