import customURIencode from "../utils/customURIencode";

export const filterReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        // SUBJECTS
        case "SET_SUBJECTS":
            let researchSubjects = [];

            payload.subjects.forEach((subject) => {
                researchSubjects.push(
                    payload.initialUrl.includes(customURIencode(subject))
                        ? { label: subject, isChecked: true }
                        : { label: subject, isChecked: false }
                );
            });

            researchSubjects = researchSubjects.map((subject) => {
                const countObject = payload.counts.find(
                    (sub_count) => sub_count.subjects__name === subject.label
                );
                if (countObject) {
                    return { ...subject, count: countObject.count };
                }
                return { ...subject, count: 0 };
            });
            return { ...state, researchSubjects };

        case "FILTER_SUBJECTS":
            return {
                ...state,
                researchSubjects: payload.researchSubjects,
            };
        ////////////////////////////////////////////////////

        // CATEGORIES
        case "SET_CATEGORIES":
            let categories = [];

            payload.categories.forEach((category) => {
                categories.push(
                    payload.initialUrl.includes(customURIencode(category[1]))
                        ? {
                              labelReact: category[1],
                              labelDjango: category[0],
                              isChecked: true,
                          }
                        : {
                              labelReact: category[1],
                              labelDjango: category[0],
                              isChecked: false,
                          }
                );
            });
            categories = categories.map((category) => {
                const countObject = payload.counts.find(
                    (cat_count) => cat_count.category == category.labelReact
                );
                if (countObject) {
                    return { ...category, count: countObject.count };
                }
                return { ...category, count: 0 };
            });
            return { ...state, categories };

        case "FILTER_CATEGORIES":
            return {
                ...state,
                categories: payload.categories,
            };
        ////////////////////////////////////////////////////

        // LANGUAGES
        case "SET_LANGUAGES":
            let languages = [];
            payload.languages.forEach((language) => {
                languages.push(
                    payload.initialUrl.includes(customURIencode(language[1]))
                        ? {
                              labelReact: language[1],
                              labelDjango: language[0],
                              isChecked: true,
                          }
                        : {
                              labelReact: language[1],
                              labelDjango: language[0],
                              isChecked: false,
                          }
                );
            });
            languages = languages.map((language) => {
                const countObject = payload.counts.find(
                    (lang_count) => lang_count.language == language.labelReact
                );
                if (countObject) {
                    return { ...language, count: countObject.count };
                }
                return { ...language, count: 0 };
            });
            return { ...state, languages };

        case "FILTER_LANGUAGES":
            return {
                ...state,
                languages: payload.languages,
            };
        ////////////////////////////////////////////////////

        case "SET_TITLE":
            return !payload.initialUrl.includes("naslov=")
                ? { ...state }
                : {
                      ...state,
                      title: decodeURI(
                          payload.initialUrl.match(/(?<=naslov=)[^&]*/)
                      ),
                  };

        case "UPDATE_TITLE":
            return { ...state, title: payload.searchTerm };

        // PUBLICATION YEARS
        case "SET_PUBLICATION_YEARS":
            if (
                payload.initialUrl.includes("izdato_pre=") &&
                !payload.initialUrl.includes("izdato_posle=") &&
                !payload.initialUrl.includes("godina_izdanja=")
            ) {
                return {
                    ...state,
                    publicationYearsRange: {
                        minYear: payload.publicationYears.min_year,
                        maxYear: payload.initialUrl.match(
                            /(?<=izdato_pre=)[^&]*/
                        ),
                    },
                    publicationYearsDefault: {
                        minYear: payload.publicationYears.min_year,
                        maxYear: payload.publicationYears.max_year,
                    },
                };
            } else if (
                !payload.initialUrl.includes("izdato_pre=") &&
                payload.initialUrl.includes("izdato_posle=") &&
                !payload.initialUrl.includes("godina_izdanja=")
            ) {
                return {
                    ...state,
                    publicationYearsRange: {
                        minYear: payload.initialUrl.match(
                            /(?<=izdato_posle=)[^&]*/
                        ),
                        maxYear: payload.publicationYears.max_year,
                    },
                    publicationYearsDefault: {
                        minYear: payload.publicationYears.min_year,
                        maxYear: payload.publicationYears.max_year,
                    },
                };
            } else if (
                payload.initialUrl.includes("izdato_pre=") &&
                payload.initialUrl.includes("izdato_posle=") &&
                !payload.initialUrl.includes("godina_izdanja=")
            ) {
                return {
                    ...state,
                    publicationYearsRange: {
                        minYear: payload.initialUrl.match(
                            /(?<=izdato_posle=)[^&]*/
                        ),
                        maxYear: payload.initialUrl.match(
                            /(?<=izdato_pre=)[^&]*/
                        ),
                    },
                    publicationYearsDefault: {
                        minYear: payload.publicationYears.min_year,
                        maxYear: payload.publicationYears.max_year,
                    },
                };
            } else if (
                !payload.initialUrl.includes("izdato_pre=") &&
                !payload.initialUrl.includes("izdato_posle=") &&
                payload.initialUrl.includes("godina_izdanja=")
            ) {
                return {
                    ...state,
                    publicationYearsRange: {
                        minYear: payload.initialUrl.match(
                            /(?<=godina_izdanja=)[^&]*/
                        ),
                        maxYear: payload.initialUrl.match(
                            /(?<=godina_izdanja=)[^&]*/
                        ),
                    },
                    publicationYearsDefault: {
                        minYear: payload.publicationYears.min_year,
                        maxYear: payload.publicationYears.max_year,
                    },
                };
            } else if (
                !payload.initialUrl.includes("izdato_pre=") &&
                !payload.initialUrl.includes("izdato_posle=") &&
                !payload.initialUrl.includes("godina_izdanja=")
            ) {
                return {
                    ...state,
                    publicationYearsRange: {
                        minYear: payload.publicationYears.min_year,
                        maxYear: payload.publicationYears.max_year,
                    },
                    publicationYearsDefault: {
                        minYear: payload.publicationYears.min_year,
                        maxYear: payload.publicationYears.max_year,
                    },
                };
            }

        case "UPDATE_PUBLICATION_YEARS":
            return {
                ...state,
                publicationYearsRange: {
                    minYear: payload.value[0],
                    maxYear: payload.value[1],
                },
            };
        ////////////////////////////////////////////////////

        // AUTHOR
        case "SET_AUTHOR":
            const firstName = payload.initialUrl.includes("autor_ime=")
                ? decodeURI(payload.initialUrl.match(/(?<=autor_ime=)[^&]*/))
                : "";
            const lastName = payload.initialUrl.includes("autor_prezime=")
                ? decodeURI(
                      payload.initialUrl.match(/(?<=autor_prezime=)[^&]*/)
                  )
                : "";

            return {
                ...state,
                author: {
                    firstName,
                    lastName,
                },
            };

        case "UPDATE_AUTHOR":
            return {
                ...state,
                author: {
                    firstName: payload.author.firstName,
                    lastName: payload.author.lastName,
                },
            };

        // PUBLISHERS
        case "SET_PUBLISHERS":
            let publishers = [];
            payload.publishers.forEach((publisher) =>
                publishers.push(publisher)
            );
            return { ...state, publishers };

        // SORTING
        case "SET_SORTING":
            const sorting_param = payload.initialUrl.includes("sortiraj_po=")
                ? decodeURI(payload.initialUrl.match(/(?<=sortiraj_po=)[^&]*/))
                : "";

            const getQueryParam = (param) => {
                const map = {
                    "Godini izdanja": "publication_year",
                    Naslovu: "title",
                    "Imenu prvog autora": "author_first",
                    "Prezimenu prvog autora": "author_last",
                };
                return map[param] || "";
            };

            const isDescending = sorting_param.startsWith("-");
            const label = isDescending ? sorting_param.slice(1) : sorting_param;
            const queryParam = getQueryParam(label);

            if (sorting_param === "" || queryParam === "") {
                return {
                    ...state,
                    sorting: {
                        label: "Podrazumevano",
                        queryParam: "",
                    },
                    sortingDirection: "ascending",
                };
            }

            return {
                ...state,
                sorting: {
                    label,
                    queryParam,
                },
                sortingDirection: isDescending ? "descending" : "ascending",
            };

        case "UPDATE_SORTING":
            return {
                ...state,
                sorting: payload.value,
                sortingDirection: payload.sortingDirectionLocal,
            };

        case "RESET_FILTERS":
            return {
                ...state,
                researchSubjects: state.researchSubjects.map((subject) => ({
                    ...subject,
                    isChecked: false,
                })),
                categories: state.categories.map((category) => ({
                    ...category,
                    isChecked: false,
                })),
                languages: state.languages.map((language) => ({
                    ...language,
                    isChecked: false,
                })),
                publicationYearsRange: {
                    minYear: state.publicationYearsDefault.minYear,
                    maxYear: state.publicationYearsDefault.maxYear,
                },
                publishers: [],
                title: "",
                author: {
                    firstName: "",
                    lastName: "",
                },
                sorting: { label: "Redosledu dodavanja", queryParam: "" },
                sortingDirection: "ascending",
            };

        default:
            return state;
    }
};
