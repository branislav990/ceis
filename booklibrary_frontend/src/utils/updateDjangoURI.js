export const updateDjangoURI = (
    reactURI,
    djangoURI,
    filterItems,
    paramName,
    urlDispatch
) => {
    let newUrl = djangoURI;

    let selectedItems;
    if (paramName === "category" || paramName === "language") {
        selectedItems = filterItems
            .filter((item) => item.isChecked)
            .map((item) => item.labelDjango);
    } else {
        selectedItems = filterItems
            .filter((item) => item.isChecked)
            .map((item) => item.label);
    }

    const queryString =
        selectedItems.length > 0
            ? `${paramName}=` +
              selectedItems.map((item) => encodeURI(item)).join(",")
            : "";

    if (queryString) {
        if (newUrl.includes(`${paramName}=`)) {
            newUrl = newUrl.replace(
                new RegExp(`(&?)${paramName}=[^&]*`),
                (match, p1) => `${p1}${queryString}`
            );
        } else if (newUrl.includes("?")) {
            newUrl += `&${queryString}`;
        } else {
            newUrl += `?${queryString}`;
        }
    } else {
        newUrl = newUrl.replace(new RegExp(`&?${paramName}=[^&]*`), "");

        if (newUrl.endsWith("?") || newUrl.endsWith("&")) {
            newUrl = newUrl.slice(0, -1);
        }
    }

    newUrl = newUrl.replace(/\?&/, "?");

    urlDispatch({
        type: "SET_DJANGO_URL",
        payload: {
            reactUrl: reactURI,
            djangoUrl: newUrl,
        },
    });
};
