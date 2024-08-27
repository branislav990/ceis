import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../contexts/FilterContext";
import "./author.css";

const Author = () => {
    const { author, filterDispatch } = useContext(FilterContext);

    const [authorLocal, setAuthorLocal] = useState({
        firstName: author.firstName,
        lastName: author.lastName,
    });

    useEffect(() => {
        setAuthorLocal({
            firstName: author.firstName,
            lastName: author.lastName,
        });
    }, [author]);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setAuthorLocal((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        filterDispatch({
            type: "UPDATE_AUTHOR",
            payload: { author: authorLocal },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="author-form">
            <input
                type="text"
                value={authorLocal.firstName}
                name="firstName"
                placeholder="Ime"
                onChange={handleChange}
                className="author-input"
            />
            <input
                type="text"
                value={authorLocal.lastName}
                name="lastName"
                placeholder="Prezime"
                onChange={handleChange}
                className="author-input"
            />
            <button type="submit" className="author-btn">
                Primeni
            </button>
        </form>
    );
};

export default Author;
