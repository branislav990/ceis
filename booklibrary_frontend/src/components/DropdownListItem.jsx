const DropdownListItem = ({ publication, isFocused, onClick, onMouseEnter }) => {
    return (
        <li
            className={`dropdown-list-item ${isFocused ? "focused" : ""}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
        >
            <h4 className="dropdown-list-title">{publication.title}</h4>
            <p className="dropdown-list-author">
                {publication.authors.length > 1 ? (
                    <>
                        {publication.authors[0].last_name},{" "}
                        {publication.authors[0].first_name[0]}.{" "}
                        <span className="et-al">et al. </span>
                    </>
                ) : (
                    `${publication.authors[0].last_name}, ${publication.authors[0].first_name[0]}. `
                )}
                ({publication.publication_year})
            </p>
        </li>
    );
};

export default DropdownListItem;
