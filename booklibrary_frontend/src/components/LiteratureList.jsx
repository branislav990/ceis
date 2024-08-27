import { useContext, useEffect, useState, useRef } from "react";
import baseEndpoint from "../utils/api";
import Loading from "./loading/Loading";
import LiteratureListItem from "./LiteratureListItem";
import "./literatureList.css";
import LiteratureFilters from "./LiteratureFilters";
import { FilterContext } from "../contexts/FilterContext";
import { URLContext } from "../contexts/URLContext";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Sorting from "./Sorting";

const LiteratureList = () => {
    const { researchSubjects, categories, languages, filterDispatch } =
        useContext(FilterContext);
    const { reactUrl, djangoUrl, urlDispatch } = useContext(URLContext);
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filteredPublications, setFilteredPublications] = useState([]);
    const [filterLoading, setFilterLoading] = useState(false);
    const [filterError, setFilterError] = useState(false);
    const [loadCounter, setLoadCounter] = useState(0);
    const [nextUrl, setNextUrl] = useState(null);
    const [nextFilteredUrl, setNextFilteredUrl] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [publicationCount, setPublicationCount] = useState(null);
    const [filteredPublicationCount, setFilteredPublicationCount] =
        useState(null);
    const [localRefresh, setLocalRefresh] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);

    console.log(initialLoading);
    console.log(loadCounter);

    let location = useLocation().search;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const publicationsResponse = await baseEndpoint.get(
                    "/biblioteka/api/literatura"
                );
                setPublications(publicationsResponse.data.results);
                setPublicationCount(publicationsResponse.data.count);
                setNextUrl(publicationsResponse.data.next);

                const researchSubjectsResponse = await baseEndpoint.get(
                    "/biblioteka/api/oblast-istrazivanja"
                );
                filterDispatch({
                    type: "SET_SUBJECTS",
                    payload: {
                        subjects: researchSubjectsResponse.data,
                        counts: publicationsResponse.data.filter_counts
                            .subject_counts,
                        initialUrl: location,
                    },
                });

                const categoriesResponse = await baseEndpoint.get(
                    "/biblioteka/api/kategorija"
                );
                filterDispatch({
                    type: "SET_CATEGORIES",
                    payload: {
                        categories: categoriesResponse.data,
                        counts: publicationsResponse.data.filter_counts
                            .category_counts,
                        initialUrl: location,
                    },
                });

                const languagesResponse = await baseEndpoint.get(
                    "/biblioteka/api/jezik"
                );
                filterDispatch({
                    type: "SET_LANGUAGES",
                    payload: {
                        languages: languagesResponse.data,
                        counts: publicationsResponse.data.filter_counts
                            .language_counts,
                        initialUrl: location,
                    },
                });

                filterDispatch({
                    type: "SET_TITLE",
                    payload: {
                        initialUrl: location,
                    },
                });

                const publicationYearResponse = await baseEndpoint.get(
                    "/biblioteka/api/godina-izdanja"
                );
                filterDispatch({
                    type: "SET_PUBLICATION_YEARS",
                    payload: {
                        publicationYears: publicationYearResponse.data,
                        initialUrl: location,
                    },
                });

                const publishersResponse = await baseEndpoint.get(
                    "/biblioteka/api/izdavac"
                );

                filterDispatch({
                    type: "SET_PUBLISHERS",
                    payload: {
                        publishers: publishersResponse.data,
                    },
                });

                filterDispatch({
                    type: "SET_AUTHOR",
                    payload: {
                        initialUrl: location,
                    },
                });

                filterDispatch({
                    type: "SET_SORTING",
                    payload: {
                        initialUrl: location,
                    },
                });
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log(`loadCounter: ${loadCounter}`);
        console.log(`djangoUrl: ${djangoUrl}`);
        const fetchFilteredData = async () => {
            try {
                // if (!(loadCounter <= 1 && location.includes("?")) || (loadCounter <= 1 && !location.includes('?')))
                setFilterLoading(true);
                // if (loadCounter > 1) {
                // }
                const filteredResults =
                    djangoUrl.length > 0
                        ? await baseEndpoint.get(
                              `/biblioteka/api/literatura${djangoUrl}`
                          )
                        : { data: { results: [] } };
                setFilteredPublications(filteredResults.data.results);
                setFilteredPublicationCount(filteredResults.data.count);
                setNextFilteredUrl(filteredResults.data.next);
            } catch (error) {
                setFilterError(true);
            } finally {
                setFilterLoading(false);
                setLoadCounter((prevCount) => prevCount + 1);
                setInitialLoading(false);
            }
        };
        fetchFilteredData();
    }, [djangoUrl, localRefresh]);

    const handleLoadMore = async () => {
        setLoadMoreLoading(true);
        if (djangoUrl.length > 0) {
            // Loading more filtered data
            if (nextFilteredUrl) {
                try {
                    const response = await baseEndpoint.get(nextFilteredUrl);
                    setFilteredPublications((prev) => [
                        ...prev,
                        ...response.data.results,
                    ]);
                    setNextFilteredUrl(response.data.next);
                } catch (error) {
                    setFilterError(true);
                } finally {
                    setLoadMoreLoading(false);
                }
            }
        } else {
            // Loading more initial data
            if (nextUrl) {
                try {
                    const response = await baseEndpoint.get(nextUrl);
                    setPublications((prev) => [
                        ...prev,
                        ...response.data.results,
                    ]);
                    setNextUrl(response.data.next);
                } catch (error) {
                    setError(true);
                } finally {
                    setLoadMoreLoading(false);
                }
            }
        }
    };

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

    const naslov = reactUrl.match(/(?<=naslov=)[^&]*/);
    const sortirano = reactUrl.match(/(?<=sortiraj_po=)[^&]*/);

    return (
        <>
            {loading ? (
                <div className="loading-wrapper-global">
                    <Loading />
                </div>
            ) : error ? (
                <div className="error-wrapper-global">
                    <h2 className="error-happened">Došlo je do greške.</h2>
                    <h2 className="error-try-again">Pokušaj ponovo.</h2>
                    <img
                        src={require("../assets/refresh.png")}
                        alt="Reload"
                        width={60}
                        className="error-refresh"
                        onClick={() => navigate(0)}
                    />
                </div>
            ) : publications.length ? (
                <>
                    <div class="blog-list-header">
                        <blockquote>
                            <p>
                                "Knjige nam omogućavaju da putujemo kroz vreme i
                                upijamo mudrost naših predaka. Biblioteke nas
                                povezuju sa znanjem velikih mislilaca iz
                                prošlosti i sa najboljim učiteljima sa svih
                                krajeva sveta, koji nas neprekidno usmeravaju i
                                inspirišu da damo svoj doprinos kolektivnom
                                znanju čovečanstva. Smatram da je zdravlje naše
                                civilizacije, dubina našeg razumevanja kulture i
                                briga za budućnost vidljiva kroz to koliko
                                podržavamo naše biblioteke." - Karl Segan
                            </p>
                        </blockquote>
                    </div>
                    <div className="library-wrapper">
                        <div className="library-full">
                            <div className="library-container">
                                <section className="library-filter-wrapper">
                                    <LiteratureFilters />
                                </section>
                                <div className="literature-results-wrapper">
                                    <div className="searchBar-sorting">
                                        <div
                                            className="search-bar-wrapper"
                                            style={{ textAlign: "right" }}
                                        >
                                            <SearchBar />
                                        </div>
                                        <div className="sorting">
                                            <Sorting />
                                        </div>
                                    </div>
                                    {filterLoading ? (
                                        <div className="loading-wrapper-local">
                                            <Loading />
                                        </div>
                                    ) : filterError ? (
                                        <div className="error-wrapper-local">
                                            <h2 className="error-happened">
                                                Došlo je do greške.
                                            </h2>
                                            <h2 className="error-try-again">
                                                Pokušaj ponovo.
                                            </h2>
                                            <img
                                                src={require("../assets/refresh.png")}
                                                alt="Reload"
                                                width={60}
                                                className="error-refresh"
                                                onClick={() =>
                                                    !location.includes("?")
                                                        ? navigate(0)
                                                        : setLocalRefresh(
                                                              !localRefresh
                                                          )
                                                }
                                            />
                                        </div>
                                    ) : // <p>Došlo je do greške</p>
                                    filteredPublications.length &&
                                      djangoUrl.length > 0 ? (
                                        <>
                                            <h3 className="publications-label">
                                                {publicationCount ==
                                                filteredPublicationCount
                                                    ? !reactUrl.includes(
                                                          "sortiraj_po"
                                                      )
                                                        ? `Nedavno dodate publikacije. Kolekcija
                                            sadrži ${filteredPublicationCount} ${
                                                              String(
                                                                  filteredPublicationCount
                                                              ).endsWith("1") &&
                                                              !(
                                                                  String(
                                                                      filteredPublicationCount
                                                                  ).endsWith(
                                                                      "11"
                                                                  ) &&
                                                                  String(
                                                                      filteredPublicationCount
                                                                  ).length == 2
                                                              )
                                                                  ? "naslov"
                                                                  : "naslova"
                                                          }.`
                                                        : `Publikacije sortirane po ${decodeURI(
                                                              String(sortirano)
                                                                  .toLowerCase()
                                                                  .replace(
                                                                      "-",
                                                                      ""
                                                                  )
                                                          )} ${
                                                              String(
                                                                  sortirano
                                                              ).includes("-")
                                                                  ? "silazno"
                                                                  : "uzlazno"
                                                          }. Kolekcija sadrži ${filteredPublicationCount} ${
                                                              String(
                                                                  filteredPublicationCount
                                                              ).endsWith("1") &&
                                                              !(
                                                                  String(
                                                                      filteredPublicationCount
                                                                  ).endsWith(
                                                                      "11"
                                                                  ) &&
                                                                  String(
                                                                      filteredPublicationCount
                                                                  ).length == 2
                                                              )
                                                                  ? "naslov"
                                                                  : "naslova"
                                                          }.`
                                                    : reactUrl.includes(
                                                          "naslov"
                                                      )
                                                    ? `Vaša pretraga za "${decodeURI(
                                                          naslov
                                                      )}" je pronašla ${filteredPublicationCount} ${
                                                          String(
                                                              filteredPublicationCount
                                                          ).endsWith("1") &&
                                                          !(
                                                              String(
                                                                  filteredPublicationCount
                                                              ).endsWith(
                                                                  "11"
                                                              ) &&
                                                              String(
                                                                  filteredPublicationCount
                                                              ).length == 2
                                                          )
                                                              ? "naslov"
                                                              : "naslova"
                                                      }
                                              .`
                                                    : `Vaša pretraga sa primenjenim filterima je pronašla ${filteredPublicationCount} 
                                            ${
                                                filteredPublicationCount == 1
                                                    ? "naslov"
                                                    : "naslova"
                                            }.`}
                                            </h3>
                                            <ul className="publication-list">
                                                {filteredPublications.map(
                                                    (publication) => (
                                                        <LiteratureListItem
                                                            publication={
                                                                publication
                                                            }
                                                            key={publication.id}
                                                        />
                                                    )
                                                )}
                                            </ul>
                                            {nextFilteredUrl && (
                                                <div className="load-more-wrapper">
                                                    {loadMoreLoading ? (
                                                        <Loading />
                                                    ) : (
                                                        <button
                                                            onClick={
                                                                handleLoadMore
                                                            }
                                                            className="load-more-btn"
                                                        >
                                                            <span className="load-more-text">
                                                                Učitaj još
                                                            </span>
                                                            <img
                                                                src={require("../assets/arrow-down.png")}
                                                                alt=""
                                                                width={20}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ) : loadCounter > 1 &&
                                      !filteredPublications.length &&
                                      djangoUrl !== "" ? (
                                        <h3 className="publications-label">
                                            Vaša pretraga je pronašla 0 naslova.
                                            Pokušajte sa drugim terminom ili
                                            kombinacijom filtera.
                                        </h3>
                                    ) : // <p>Broj rezultata = 0</p>
                                    !(
                                          loadCounter <= 1 &&
                                          location.includes("?")
                                      ) ? (
                                        <>
                                            <h3 className="publications-label">
                                                Nedavno dodate publikacije.
                                                Kolekcija sadrži{" "}
                                                {publicationCount}{" "}
                                                {String(
                                                    publicationCount
                                                ).endsWith("1") &&
                                                !(
                                                    String(
                                                        publicationCount
                                                    ).endsWith("11") &&
                                                    String(publicationCount)
                                                        .length == 2
                                                )
                                                    ? "naslov"
                                                    : "naslova"}
                                                .
                                            </h3>
                                            <ul className="publication-list">
                                                {publications.map(
                                                    (publication) => (
                                                        <LiteratureListItem
                                                            publication={
                                                                publication
                                                            }
                                                            key={publication.id}
                                                        />
                                                    )
                                                )}
                                            </ul>
                                            {nextUrl && (
                                                <div className="load-more-wrapper">
                                                    {loadMoreLoading ? (
                                                        <div style={{width: "5em"}}>
                                                            <Loading />
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={
                                                                handleLoadMore
                                                            }
                                                            className="load-more-btn"
                                                        >
                                                            <span className="load-more-text">
                                                                Učitaj još
                                                            </span>
                                                            <img
                                                                src={require("../assets/arrow-down.png")}
                                                                alt=""
                                                                width={20}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>Nema knjiga</p>
            )}
        </>
    );
};

export default LiteratureList;
