useEffect(() => {
    let newUrl = reactUrl;
    const selectedSubjects = researchSubjects
        .filter((subject) => subject.isChecked)
        .map((subject) => subject.label);

    const subjectQueryString =
        selectedSubjects.length > 0
            ? "oblast_istrazivanja=" +
              selectedSubjects
                  .map((subject) => customURIencode(subject))
                  .join("%2C")
            : "";

    if (newUrl.includes("oblast_istrazivanja=")) {
        newUrl = newUrl.replace(
            /&?oblast_istrazivanja=[^&]*/,
            subjectQueryString
        );
    } else if (newUrl.includes("?")) {
        newUrl += `&${subjectQueryString}`;
    } else if (newUrl === "" && selectedSubjects.length == 0) {
        newUrl += `?${subjectQueryString}`;
    } else if (newUrl.endsWith("?")) {
        newUrl = newUrl.slice(0, -1);
    }

    if (subjectQueryString) {
        // Check if newUrl is empty, then initialize it with ?
        if (newUrl === "") {
            newUrl = `?${subjectQueryString}`;
        }
        // Check if newUrl already has oblast_istrazivanja query, then replace it
        else if (newUrl.includes("oblast_istrazivanja=")) {
            newUrl = newUrl.replace(
                /(&?)oblast_istrazivanja=[^&]*/,
                (match, p1) => `${p1}${subjectQueryString}`
            );
        }
        // Check if newUrl already has some query parameters, then append with &
        else if (newUrl.includes("?")) {
            newUrl += `&${subjectQueryString}`;
        }
        // No query parameters in newUrl, start query string with ?
        else {
            newUrl += `?${subjectQueryString}`;
        }
    } else {
        // If subjectQueryString is empty, remove any existing oblast_istrazivanja parameter
        newUrl = newUrl.replace(/&?oblast_istrazivanja=[^&]*/, "");

        // If the remaining URL ends with ?, remove it
        if (newUrl.endsWith("?")) {
            newUrl = newUrl.slice(0, -1);
        }

        // If there's a dangling &, remove it
        if (newUrl.includes("?") && newUrl.endsWith("&")) {
            newUrl = newUrl.slice(0, -1);
        }
    }

    newUrl = newUrl.replace(/\?&/, "?");

    urlDispatch({
        type: "SET_URL",
        payload: {
            reactUrl: newUrl,
            djangoUrl: "",
        },
    });

    console.log(`new url: ${newUrl}`);
    console.log(`react url: ${reactUrl}`);

    navigate(newUrl);
}, [researchSubjects]);