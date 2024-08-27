import customURIencode from "./customURIencode";

export const updateURI = (
    reactURI,
    djangoURI,
    filters,
    title,
    publicationYears,
    publicationYearsDefault,
    author,
    sorting,
    sortingDirection,
    urlDispatch,
    navigate
) => {
    // SETTING REACT URI
    let newReactUrl = reactURI;

    filters.forEach(({ items, reactParamName, djangoParamName }) => {
        let selectedReactItems = items
            .filter((item) => item.isChecked)
            .map((item) =>
                reactParamName === "tip_publikacije" ||
                reactParamName === "jezik"
                    ? item.labelReact
                    : item.label
            );

        const reactQueryString =
            selectedReactItems.length > 0
                ? `${reactParamName}=` +
                  selectedReactItems.map(customURIencode).join("%2C")
                : "";

        if (reactQueryString) {
            if (newReactUrl.includes(`${reactParamName}=`)) {
                newReactUrl = newReactUrl.replace(
                    new RegExp(`(&?)${reactParamName}=[^&]*`),
                    (match, p1) => `${p1}${reactQueryString}`
                );
            } else if (newReactUrl.includes("?")) {
                newReactUrl += `&${reactQueryString}`;
            } else {
                newReactUrl += `?${reactQueryString}`;
            }
        } else {
            newReactUrl = newReactUrl.replace(
                new RegExp(`&?${reactParamName}=[^&]*`),
                ""
            );

            if (newReactUrl.endsWith("?") || newReactUrl.endsWith("&")) {
                newReactUrl = newReactUrl.slice(0, -1);
            }
        }
    });

    if (title.length > 0) {
        console.log(`tip: ${typeof title}`);

        if (newReactUrl.includes("naslov=")) {
            newReactUrl = newReactUrl.replace(
                /naslov=[^&]*/,
                `naslov=${encodeURI(title)}`
            );
        } else if (newReactUrl.includes("?")) {
            newReactUrl += `&naslov=${encodeURI(title)}`;
        } else {
            newReactUrl += `?naslov=${encodeURI(title)}`;
        }
    } else {
        newReactUrl = newReactUrl.replace(new RegExp(`&?naslov=[^&]*`), "");
    }

    console.log(`reactURL: ${newReactUrl}`);

    // Godina izdanja
    if (
        publicationYears.minYear === publicationYearsDefault.minYear &&
        publicationYears.maxYear === publicationYearsDefault.maxYear
    ) {
        newReactUrl = newReactUrl
            .replace(new RegExp(`&?izdato_pre=[^&]*`), "")
            .replace(new RegExp(`&?izdato_posle=[^&]*`), "")
            .replace(new RegExp(`&?godina_izdanja=[^&]*`), "");
    } else if (publicationYears.minYear === publicationYears.maxYear) {
        if (newReactUrl.includes("godina_izdanja=")) {
            newReactUrl = newReactUrl.replace(
                /godina_izdanja=[^&]*/,
                `godina_izdanja=${publicationYears.maxYear}`
            );
        } else if (newReactUrl.includes("?")) {
            newReactUrl += `&godina_izdanja=${publicationYears.maxYear}`;
        } else {
            newReactUrl += `?godina_izdanja=${publicationYears.maxYear}`;
        }
        newReactUrl = newReactUrl
            .replace(new RegExp(`&?izdato_posle=[^&]*`), "")
            .replace(new RegExp(`&?izdato_pre=[^&]*`), "");
    } else if (
        publicationYears.minYear === publicationYearsDefault.minYear &&
        publicationYears.maxYear !== publicationYearsDefault.maxYear
    ) {
        if (newReactUrl.includes("izdato_pre=")) {
            newReactUrl = newReactUrl.replace(
                /izdato_pre=[^&]*/,
                `izdato_pre=${publicationYears.maxYear}`
            );
        } else if (newReactUrl.includes("?")) {
            newReactUrl += `&izdato_pre=${publicationYears.maxYear}`;
        } else {
            newReactUrl += `?izdato_pre=${publicationYears.maxYear}`;
        }
        newReactUrl = newReactUrl
            .replace(new RegExp(`&?izdato_posle=[^&]*`), "")
            .replace(new RegExp(`&?godina_izdanja=[^&]*`), "");
    } else if (
        publicationYears.minYear !== publicationYearsDefault.minYear &&
        publicationYears.maxYear === publicationYearsDefault.maxYear
    ) {
        if (newReactUrl.includes("izdato_posle=")) {
            newReactUrl = newReactUrl.replace(
                /izdato_posle=[^&]*/,
                `izdato_posle=${publicationYears.minYear}`
            );
        } else if (newReactUrl.includes("?")) {
            newReactUrl += `&izdato_posle=${publicationYears.minYear}`;
        } else {
            newReactUrl += `?izdato_posle=${publicationYears.minYear}`;
        }
        newReactUrl = newReactUrl
            .replace(new RegExp(`&?izdato_pre=[^&]*`), "")
            .replace(new RegExp(`&?godina_izdanja=[^&]*`), "");
    } else if (
        publicationYears.minYear !== publicationYearsDefault.minYear &&
        publicationYears.maxYear !== publicationYearsDefault.maxYear
    ) {
        if (newReactUrl.includes("izdato_posle=")) {
            newReactUrl = newReactUrl.replace(
                /izdato_posle=[^&]*/,
                `izdato_posle=${publicationYears.minYear}`
            );
        } else if (newReactUrl.includes("?")) {
            newReactUrl += `&izdato_posle=${publicationYears.minYear}`;
        } else {
            newReactUrl += `?izdato_posle=${publicationYears.minYear}`;
        }

        if (newReactUrl.includes("izdato_pre=")) {
            newReactUrl = newReactUrl.replace(
                /izdato_pre=[^&]*/,
                `izdato_pre=${publicationYears.maxYear}`
            );
        } else {
            newReactUrl += `&izdato_pre=${publicationYears.maxYear}`;
        }
        newReactUrl = newReactUrl.replace(
            new RegExp(`&?godina_izdanja=[^&]*`),
            ""
        );
    }
    ////////////////////////////////////

    // Autor
    if (author.firstName.length > 0) {
        if (newReactUrl.includes("autor_ime=")) {
            newReactUrl = newReactUrl.replace(
                /autor_ime=[^&]*/,
                `autor_ime=${encodeURI(author.firstName)}`
            );
        } else if (newReactUrl.includes("?")) {
            newReactUrl += `&autor_ime=${encodeURI(author.firstName)}`;
        } else {
            newReactUrl += `?autor_ime=${encodeURI(author.firstName)}`;
        }
    } else {
        newReactUrl = newReactUrl.replace(new RegExp(`&?autor_ime=[^&]*`), "");
    }

    if (author.lastName.length > 0) {
        if (newReactUrl.includes("autor_prezime=")) {
            newReactUrl = newReactUrl.replace(
                /autor_prezime=[^&]*/,
                `autor_prezime=${encodeURI(author.lastName)}`
            );
        } else if (newReactUrl.includes("?")) {
            newReactUrl += `&autor_prezime=${encodeURI(author.lastName)}`;
        } else {
            newReactUrl += `?autor_prezime=${encodeURI(author.lastName)}`;
        }
    } else {
        newReactUrl = newReactUrl.replace(
            new RegExp(`&?autor_prezime=[^&]*`),
            ""
        );
    }
    //////////////////////

    // Sorting
    if (sorting.queryParam.length > 0) {
        if (newReactUrl.includes("sortiraj_po=")) {
            newReactUrl =
                sortingDirection == "descending"
                    ? newReactUrl.replace(
                          /sortiraj_po=[^&]*/,
                          `sortiraj_po=-${encodeURI(sorting.label)}`
                      )
                    : newReactUrl.replace(
                          /sortiraj_po=[^&]*/,
                          `sortiraj_po=${encodeURI(sorting.label)}`
                      );
        } else if (newReactUrl.includes("?")) {
            newReactUrl +=
                sortingDirection == "descending"
                    ? `&sortiraj_po=-${encodeURI(sorting.label)}`
                    : `&sortiraj_po=${encodeURI(sorting.label)}`;
        } else {
            newReactUrl +=
                sortingDirection == "descending"
                    ? `?sortiraj_po=-${encodeURI(sorting.label)}`
                    : `?sortiraj_po=${encodeURI(sorting.label)}`;
        }
    } else {
        newReactUrl = newReactUrl.replace(
            new RegExp(`&?sortiraj_po=[^&]*`),
            ""
        );
    }

    newReactUrl = newReactUrl.replace(/\?&/, "?");

    navigate(newReactUrl);

    // SETTING DJANGO URI
    let newDjangoUrl = djangoURI;

    filters.forEach(({ items, reactParamName, djangoParamName }) => {
        let selectedDjangoItems = items
            .filter((item) => item.isChecked)
            .map((item) =>
                djangoParamName === "category" || djangoParamName === "language"
                    ? item.labelDjango
                    : item.label
            );

        const djangoQueryString =
            selectedDjangoItems.length > 0
                ? `${djangoParamName}=` +
                  selectedDjangoItems.map(encodeURI).join(",")
                : "";

        if (djangoQueryString) {
            if (newDjangoUrl.includes(`${djangoParamName}=`)) {
                newDjangoUrl = newDjangoUrl.replace(
                    new RegExp(`(&?)${djangoParamName}=[^&]*`),
                    (match, p1) => `${p1}${djangoQueryString}`
                );
            } else if (newDjangoUrl.includes("?")) {
                newDjangoUrl += `&${djangoQueryString}`;
            } else {
                newDjangoUrl += `?${djangoQueryString}`;
            }
        } else {
            newDjangoUrl = newDjangoUrl.replace(
                new RegExp(`&?${djangoParamName}=[^&]*`),
                ""
            );

            if (newDjangoUrl.endsWith("?") || newDjangoUrl.endsWith("&")) {
                newDjangoUrl = newDjangoUrl.slice(0, -1);
            }
        }
    });

    if (title.length > 0) {
        if (newDjangoUrl.includes("title=")) {
            newDjangoUrl = newDjangoUrl.replace(
                /title=[^&]*/,
                `title=${encodeURI(title)}`
            );
        } else if (newDjangoUrl.includes("?")) {
            newDjangoUrl += `&title=${encodeURI(title)}`;
        } else {
            newDjangoUrl += `?title=${encodeURI(title)}`;
        }
    } else {
        newDjangoUrl = newDjangoUrl.replace(new RegExp(`&?title=[^&]*`), "");
    }

    // Godina izdanja
    if (
        publicationYears.minYear === publicationYearsDefault.minYear &&
        publicationYears.maxYear === publicationYearsDefault.maxYear
    ) {
        newDjangoUrl = newDjangoUrl
            .replace(new RegExp(`&?published_before=[^&]*`), "")
            .replace(new RegExp(`&?published_after=[^&]*`), "")
            .replace(new RegExp(`&?published_year=[^&]*`), "");
    } else if (publicationYears.minYear === publicationYears.maxYear) {
        if (newDjangoUrl.includes("published_year=")) {
            newDjangoUrl = newDjangoUrl.replace(
                /published_year=[^&]*/,
                `published_year=${publicationYears.maxYear}`
            );
        } else if (newDjangoUrl.includes("?")) {
            newDjangoUrl += `&published_year=${publicationYears.maxYear}`;
        } else {
            newDjangoUrl += `?published_year=${publicationYears.maxYear}`;
        }
        newDjangoUrl = newDjangoUrl
            .replace(new RegExp(`&?published_after=[^&]*`), "")
            .replace(new RegExp(`&?published_before=[^&]*`), "");
    } else if (
        publicationYears.minYear === publicationYearsDefault.minYear &&
        publicationYears.maxYear !== publicationYearsDefault.maxYear
    ) {
        if (newDjangoUrl.includes("published_before=")) {
            newDjangoUrl = newDjangoUrl.replace(
                /published_before=[^&]*/,
                `published_before=${publicationYears.maxYear}`
            );
        } else if (newDjangoUrl.includes("?")) {
            newDjangoUrl += `&published_before=${publicationYears.maxYear}`;
        } else {
            newDjangoUrl += `?published_before=${publicationYears.maxYear}`;
        }
        newDjangoUrl = newDjangoUrl
            .replace(new RegExp(`&?published_after=[^&]*`), "")
            .replace(new RegExp(`&?published_year=[^&]*`), "");
    } else if (
        publicationYears.minYear !== publicationYearsDefault.minYear &&
        publicationYears.maxYear === publicationYearsDefault.maxYear
    ) {
        if (newDjangoUrl.includes("published_after=")) {
            newDjangoUrl = newDjangoUrl.replace(
                /published_after=[^&]*/,
                `published_after=${publicationYears.minYear}`
            );
        } else if (newDjangoUrl.includes("?")) {
            newDjangoUrl += `&published_after=${publicationYears.minYear}`;
        } else {
            newDjangoUrl += `?published_after=${publicationYears.minYear}`;
        }
        newDjangoUrl = newDjangoUrl
            .replace(new RegExp(`&?published_before=[^&]*`), "")
            .replace(new RegExp(`&?published_year=[^&]*`), "");
    } else if (
        publicationYears.minYear !== publicationYearsDefault.minYear &&
        publicationYears.maxYear !== publicationYearsDefault.maxYear
    ) {
        if (newDjangoUrl.includes("published_after=")) {
            newDjangoUrl = newDjangoUrl.replace(
                /published_after=[^&]*/,
                `published_after=${publicationYears.minYear}`
            );
        } else if (newDjangoUrl.includes("?")) {
            newDjangoUrl += `&published_after=${publicationYears.minYear}`;
        } else {
            newDjangoUrl += `?published_after=${publicationYears.minYear}`;
        }

        if (newDjangoUrl.includes("published_before=")) {
            newDjangoUrl = newDjangoUrl.replace(
                /published_before=[^&]*/,
                `published_before=${publicationYears.maxYear}`
            );
        } else {
            newDjangoUrl += `&published_before=${publicationYears.maxYear}`;
        }
        newDjangoUrl = newDjangoUrl.replace(
            new RegExp(`&?published_year=[^&]*`),
            ""
        );
    }
    ////////////////////////////////////

    // Autor
    if (author.firstName.length > 0) {
        if (newDjangoUrl.includes("author_first=")) {
            newDjangoUrl = newDjangoUrl.replace(
                /author_first=[^&]*/,
                `author_first=${encodeURI(author.firstName)}`
            );
        } else if (newDjangoUrl.includes("?")) {
            newDjangoUrl += `&author_first=${encodeURI(author.firstName)}`;
        } else {
            newDjangoUrl += `?author_first=${encodeURI(author.firstName)}`;
        }
    } else {
        newDjangoUrl = newDjangoUrl.replace(
            new RegExp(`&?author_first=[^&]*`),
            ""
        );
    }

    if (author.lastName.length > 0) {
        if (newDjangoUrl.includes("author_last=")) {
            newDjangoUrl = newDjangoUrl.replace(
                /author_last=[^&]*/,
                `author_last=${encodeURI(author.lastName)}`
            );
        } else if (newDjangoUrl.includes("?")) {
            newDjangoUrl += `&author_last=${encodeURI(author.lastName)}`;
        } else {
            newDjangoUrl += `?author_last=${encodeURI(author.lastName)}`;
        }
    } else {
        newDjangoUrl = newDjangoUrl.replace(
            new RegExp(`&?author_last=[^&]*`),
            ""
        );
    }
    //////////////////////

    // Sorting
    if (sorting.queryParam.length > 0) {
        if (newDjangoUrl.includes("order_by=")) {
            newDjangoUrl =
                sortingDirection == "descending"
                    ? newDjangoUrl.replace(
                          /order_by=[^&]*/,
                          `order_by=-${encodeURI(sorting.queryParam)}`
                      )
                    : newDjangoUrl.replace(
                          /order_by=[^&]*/,
                          `order_by=${encodeURI(sorting.queryParam)}`
                      );
        } else if (newDjangoUrl.includes("?")) {
            newDjangoUrl +=
                sortingDirection == "descending"
                    ? `&order_by=-${encodeURI(sorting.queryParam)}`
                    : `&order_by=${encodeURI(sorting.queryParam)}`;
        } else {
            newDjangoUrl +=
                sortingDirection == "descending"
                    ? `?order_by=-${encodeURI(sorting.queryParam)}`
                    : `?order_by=${encodeURI(sorting.queryParam)}`;
        }
    } else {
        newDjangoUrl = newDjangoUrl.replace(new RegExp(`&?order_by=[^&]*`), "");
    }
    ///////////////////////

    newDjangoUrl = newDjangoUrl.replace(/\?&/, "?");

    urlDispatch({
        type: "SET_URL",
        payload: {
            reactUrl: newReactUrl,
            djangoUrl: newDjangoUrl,
        },
    });
};