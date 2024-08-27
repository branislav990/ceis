import { Link } from "react-router-dom";
import "./literatureListItem.css";

const LiteratureListItem = ({ publication }) => {
    let authors = [];

    for (let [index, author] of publication.authors.entries()) {
        authors.push(
            <span key={index}>
                {author.last_name}, {author.first_name}
                {publication.authors.length > 3 && index === 2
                    ? "; et al. "
                    : publication.authors.length > index + 1
                    ? "; "
                    : " "}
            </span>
        );
        if (index === 2) break;
    }

    return (
        <li className="publication-list-item">
            <div className="publication-list-img-wrapper">
                <Link
                    to={`/${encodeURI(publication.title)}`}
                    className="publication-list-img-link"
                >
                    <img
                        src={publication.cover_image}
                        alt={publication.title}
                        className="publication-list-img"
                    />
                </Link>
            </div>
            <div className="publication-list-info">
                <Link
                    to={`/${encodeURI(publication.title)}`}
                    className="publication-list-title-link"
                >
                    <h2 className="publication-list-title">
                        {publication.title}
                    </h2>
                </Link>
                <div className="publication-list-details">
                    <p className="publication-list-authors">
                        {authors}
                        <span>({publication.publication_year})</span>
                    </p>
                </div>
            </div>
        </li>
    );
};

export default LiteratureListItem;
