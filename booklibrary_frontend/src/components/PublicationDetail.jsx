import { useEffect, useState } from "react";
import "./publicationDetail.css";
import { useNavigate, useParams, Link } from "react-router-dom";
import baseEndpoint from "../utils/api";
import Loading from "./loading/Loading";
import { Modal, ModalBody } from "baseui/modal";
import PDFViewer from "./PDFViewer";
import GoBack from "./GoBack";

const PublicationDetail = () => {
    const [publication, setPublication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const { publicationTitle } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const publicationResponse = await baseEndpoint.get(
                    `biblioteka/api/literatura?title_single=${publicationTitle}`
                );
                setPublication(publicationResponse.data.results[0]);
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [publicationTitle]);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <div className="publication-detail-wrapper">
                {loading ? (
                    <div className="loading-wrapper-global">
                        <Loading />
                    </div>
                ) : error ? (
                    <p>Došlo je do greške</p>
                ) : (
                    <>
                        {publication ? (
                            <>
                                <GoBack
                                    returnToLocation={"/"}
                                    label={"Nazad na listu publikacija"}
                                />

                                <Link
                                    to={`/${publicationTitle}/pdf`}
                                    target="_blank"
                                    style={{ textDecoration: "none" }}
                                >
                                    <h1 className="detail-publication-title">
                                        <span>{publication.title}</span>{" "}
                                        <img
                                            src={require("../assets/new-tab.png")}
                                            alt="Open to read"
                                            height={40}
                                            style={{ marginLeft: "2em" }}
                                        />
                                    </h1>
                                </Link>

                                <Modal
                                    onClose={() => setIsModalOpen(false)}
                                    isOpen={isModalOpen}
                                    overrides={{
                                        Root: {
                                            style: {
                                                padding: 0,
                                            },
                                        },
                                        Dialog: {
                                            style: {
                                                width: "85vw",
                                                height: "80vh",
                                                display: "flex",
                                                flexDirection: "column",
                                                padding: "0",
                                                margin: 0,
                                            },
                                        },
                                        DialogContainer: {
                                            style: {
                                                padding: 0,
                                            },
                                        },
                                        Close: {
                                            style: {
                                                display: "none",
                                            },
                                        },
                                    }}
                                >
                                    <ModalBody
                                        style={{
                                            flex: "1 1 0",
                                            overflow: "auto",
                                        }}
                                    >
                                        <PDFViewer
                                            publicationDrawer={publication}
                                        />
                                    </ModalBody>
                                </Modal>

                                {isModalOpen && (
                                    <button
                                        style={{
                                            position: "fixed",
                                            right: "1em",
                                            top: "1em",
                                            color: "white",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            zIndex: 1000,
                                        }}
                                        onClick={() => setIsModalOpen(false)}
                                        title="Zatvori"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="2em"
                                            height="2em"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line
                                                x1="18"
                                                y1="6"
                                                x2="6"
                                                y2="18"
                                            />
                                            <line
                                                x1="6"
                                                y1="6"
                                                x2="18"
                                                y2="18"
                                            />
                                        </svg>
                                    </button>
                                )}

                                <div className="publication-img-details">
                                    <section className="detail-cover-img-details">
                                        <img
                                            src={publication.cover_image}
                                            alt="Publication cover image"
                                            onClick={() => setIsModalOpen(true)}
                                            title="Prelistaj"
                                            className="detail-cover-img"
                                        />
                                    </section>

                                    <table className="pub-details-right">
                                        <tr>
                                            <th>
                                                {publication.authors.length > 1
                                                    ? "Autori"
                                                    : "Autor"}
                                            </th>
                                            <td>
                                                <ul>
                                                    {publication.authors.map(
                                                        (author) => (
                                                            <li>
                                                                {
                                                                    author.last_name
                                                                }
                                                                ,{" "}
                                                                {
                                                                    author.first_name
                                                                }
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Godina izdanja</th>
                                            <td>
                                                {publication.publication_year}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                {publication.publishers.length >
                                                1
                                                    ? "Izdavači"
                                                    : "Izdavač"}
                                            </th>
                                            <td>
                                                <ul>
                                                    {publication.publishers.map(
                                                        (publisher) => (
                                                            <li>
                                                                {publisher.website ? (
                                                                    <a
                                                                        href={
                                                                            publisher.website
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        {
                                                                            publisher.name
                                                                        }{" "}
                                                                        (
                                                                        {
                                                                            publisher.place
                                                                        }
                                                                        )
                                                                    </a>
                                                                ) : (
                                                                    <p style={{margin: "0em"}}>
                                                                        {
                                                                            publisher.name
                                                                        }{" "}
                                                                        (
                                                                        {
                                                                            publisher.place
                                                                        }
                                                                        )
                                                                    </p>
                                                                )}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Tip publikacije</th>
                                            <td>{publication.category}</td>
                                        </tr>
                                        {publication.journal ? (
                                            <tr>
                                                <th>Časopis</th>
                                                <td>
                                                    {publication.journal.name}
                                                </td>
                                            </tr>
                                        ) : null}
                                        {publication.sci_conf ? (
                                            <tr>
                                                <th>Naučni skup</th>
                                                <td>
                                                    {publication.sci_conf.name}
                                                </td>
                                            </tr>
                                        ) : null}
                                        <tr>
                                            <th>
                                                {publication.subjects.length > 1
                                                    ? "Oblasti istraživanja"
                                                    : "Oblast istraživanja"}
                                            </th>
                                            <td>
                                                <ul>
                                                    {publication.subjects.map(
                                                        (subject) => (
                                                            <li>
                                                                {subject.name}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Jezik</th>
                                            <td>{publication.language}</td>
                                        </tr>
                                        {publication.isbn ? (
                                            <tr>
                                                <th>ISBN</th>
                                                <td>{publication.isbn}</td>
                                            </tr>
                                        ) : null}
                                        {publication.doi ? (
                                            <tr>
                                                <th>DOI</th>
                                                <td>
                                                    <a
                                                        href={`https://doi.org/${publication.doi}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {screenWidth > 420
                                                            ? `https://doi.org/${publication.doi}`
                                                            : `${publication.doi}`}
                                                    </a>
                                                    {/* <a
                                                        href={`https://doi.org/${publication.doi}`}
                                                        target="_blank"
                                                    >
                                                        {screenWidth > "500px"
                                                            ? `https://doi.org/${publication.doi}`
                                                            : `${publication.doi}`}
                                                    </a> */}
                                                </td>
                                            </tr>
                                        ) : null}
                                    </table>
                                </div>
                            </>
                        ) : (
                            <>
                                <GoBack
                                    returnToLocation={"/"}
                                    label={"Nazad na listu publikacija"}
                                />
                                <p>Tražena publikacija nije dostupna</p>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default PublicationDetail;
