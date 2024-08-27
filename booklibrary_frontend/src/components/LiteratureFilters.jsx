import { useContext, useEffect, useState } from "react";
import { StatelessAccordion, Accordion, Panel } from "baseui/accordion";
import ResearchSubjects from "./ResearchSubjects";
import Categories from "./Categories";
import Languages from "./Language";
import PublicationYear from "./PublicationYear";
import Author from "./Author";
import { useNavigate } from "react-router-dom";
import { URLContext } from "../contexts/URLContext";
import { updateURI } from "../utils/updateReactURI";
import { FilterContext } from "../contexts/FilterContext";
import "./literatureFilters.css";

const LiteratureFilters = () => {
    const {
        researchSubjects,
        categories,
        languages,
        title,
        publicationYearsRange,
        publicationYearsDefault,
        author,
        sorting,
        sortingDirection,
        filterDispatch,
    } = useContext(FilterContext);
    const { reactUrl, djangoUrl, urlDispatch } = useContext(URLContext);

    const isPublicationYearFiltered =
        publicationYearsRange.minYear !== publicationYearsDefault.minYear ||
        publicationYearsRange.maxYear !== publicationYearsDefault.maxYear;
    const isAuthorFiltered = author.firstName.length || author.lastName.length;
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const getExpandedPanels = () => {
        let panels = ["P1"];

        if (categories.some((category) => category.isChecked)) {
            panels.push("P2");
            if (isPublicationYearFiltered) panels.push("P4");
            if (isAuthorFiltered) panels.push("P5");
        } else if (languages.some((language) => language.isChecked)) {
            panels.push("P2", "P3");
            if (isPublicationYearFiltered) panels.push("P4");
            if (isAuthorFiltered) panels.push("P5");
        } else {
            if (isPublicationYearFiltered) panels.push("P4");
            if (isAuthorFiltered) panels.push("P5");
        }

        return panels;
    };

    const [expanded, setExpanded] = useState(getExpandedPanels());

    const handleChange = (key) => {
        setExpanded(
            (prevExpanded) =>
                prevExpanded.includes(key)
                    ? prevExpanded.filter((k) => k !== key) // Remove key if it exists
                    : [...prevExpanded, key] // Add key if it doesn't exist
        );
    };

    const navigate = useNavigate();

    const handleClearFilters = () => {
        filterDispatch({
            type: "RESET_FILTERS",
        });
    };

    useEffect(() => {
        updateURI(
            reactUrl,
            djangoUrl,
            [
                {
                    items: researchSubjects,
                    reactParamName: "oblast_istrazivanja",
                    djangoParamName: "subject",
                },
                {
                    items: categories,
                    reactParamName: "tip_publikacije",
                    djangoParamName: "category",
                },
                {
                    items: languages,
                    reactParamName: "jezik",
                    djangoParamName: "language",
                },
            ],
            title,
            publicationYearsRange,
            publicationYearsDefault,
            author,
            sorting,
            sortingDirection,
            urlDispatch,
            navigate
        );
    }, [
        categories,
        researchSubjects,
        languages,
        publicationYearsRange,
        title,
        author,
        sorting,
        sortingDirection,
    ]);

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

    const paddingInlineValue = screenWidth < 576 ? "0.5em" : "1em";

    return (
        <>
            {screenWidth < 1000 ? (
                <Accordion
                    accordion
                    overrides={{
                        Content: {
                            style: {
                                paddingTop: "1em",
                                border: "1px solid #DCDFE4",
                                paddingBottom: "0.8em",
                                paddingInline: "1em",
                            },
                        },
                        Header: {
                            style: {
                                color: "white",
                                backgroundColor: "#AF4D00",
                                padding: "0.7em",
                                paddingInline: "1em",
                                fontFamily: "Barlow",
                                fontWeight: "bold",
                                letterSpacing: "0.07em",
                                ":hover": {
                                    color: "white",
                                },
                            },
                        },
                        PanelContainer: {
                            style: {
                                marginBottom: "1em",
                                borderBottom: "none",
                            },
                        },
                        ToggleIcon: {
                            style: {
                                color: "#F2F5F7",
                            },
                        },
                    }}
                >
                    <Panel title="Filtriraj publikacije">
                        <h5
                            onClick={handleClearFilters}
                            className="clearFilters"
                            style={{ opacity: 1 }}
                        >
                            Poništi sve filtere
                        </h5>
                        <StatelessAccordion
                            expanded={expanded}
                            onChange={({ key }) => handleChange(key)}
                            overrides={{
                                Content: {
                                    style: {
                                        paddingTop: "0.8em",
                                        border: "1px solid #DCDFE4",
                                        paddingBottom: "0.8em",
                                    },
                                },
                                Header: {
                                    style: {
                                        backgroundColor: "#F2F5F7",
                                        padding: "0.7em",
                                        paddingInline: "1em",
                                        fontFamily: "Barlow",
                                        fontWeight: "bold",
                                        letterSpacing: "0.04em",
                                    },
                                },
                                PanelContainer: {
                                    style: {
                                        marginBottom: "1em",
                                        borderBottom: "none",
                                    },
                                },
                                ToggleIcon: {
                                    style: {
                                        color: "#af4d00",
                                    },
                                },
                            }}
                        >
                            <Panel key="P1" title="Oblast istraživanja">
                                <ResearchSubjects />
                            </Panel>
                            <Panel key="P2" title="Tip publikacije">
                                <Categories />
                            </Panel>
                            <Panel key="P3" title="Jezik">
                                <Languages />
                            </Panel>
                            <Panel key="P4" title="Godina izdanja">
                                <PublicationYear />
                            </Panel>
                            <Panel key="P5" title="Autor">
                                <Author />
                            </Panel>
                        </StatelessAccordion>
                    </Panel>
                </Accordion>
            ) : (
                <>
                    <h5 onClick={handleClearFilters} className="clearFilters">
                        Poništi sve filtere
                    </h5>
                    <h3 className="filter-header">Filtriraj publikacije</h3>
                    <StatelessAccordion
                        expanded={expanded}
                        onChange={({ key }) => handleChange(key)}
                        overrides={{
                            Content: {
                                style: {
                                    paddingTop: "0.8em",
                                    border: "1px solid #DCDFE4",
                                    paddingBottom: "0.8em",
                                },
                            },
                            Header: {
                                style: {
                                    backgroundColor: "#F2F5F7",
                                    padding: "0.7em",
                                    paddingInline: "1em",
                                    fontFamily: "Barlow",
                                    fontWeight: "bold",
                                    letterSpacing: "0.04em",
                                },
                            },
                            PanelContainer: {
                                style: {
                                    marginBottom: "1em",
                                    borderBottom: "none",
                                },
                            },
                            ToggleIcon: {
                                style: {
                                    color: "#af4d00",
                                },
                            },
                        }}
                    >
                        <Panel key="P1" title="Oblast istraživanja">
                            <ResearchSubjects />
                        </Panel>
                        <Panel key="P2" title="Tip publikacije">
                            <Categories />
                        </Panel>
                        <Panel key="P3" title="Jezik">
                            <Languages />
                        </Panel>
                        <Panel key="P4" title="Godina izdanja">
                            <PublicationYear />
                        </Panel>
                        <Panel key="P5" title="Autor">
                            <Author />
                        </Panel>
                    </StatelessAccordion>
                </>
            )}
        </>
    );
    

    // return (
    //     <>
    //         {screenWidth < 900 ? <>
    //             <Accordion
    //                 onChange={{ expanded }}
    //                 accordion
    //                 overrides={{
    //                     Content: {
    //                         style: {
    //                             paddingTop: "1em",
    //                             border: "1px solid #DCDFE4",
    //                             paddingBottom: "0.8em",
    //                             paddingInline: '1em'
    //                         },
    //                     },
    //                     Header: {
    //                         style: {
    //                             color: "white",
    //                             backgroundColor: "#AF4D00",
    //                             padding: "0.7em",
    //                             paddingInline: "1em",
    //                             fontFamily: "Barlow",
    //                             fontWeight: "bold",
    //                             letterSpacing: "0.07em",
    //                             ":hover": {
    //                                 color: "white"
    //                             }
    //                         },
    //                     },
    //                     PanelContainer: {
    //                         style: {
    //                             marginBottom: "1em",
    //                             borderBottom: "none",
    //                         },
    //                     },
    //                     ToggleIcon: {
    //                         style: {
    //                             color: "#F2F5F7",
    //                         },
    //                     },
    //                 }}
    //             >
    //                 <Panel title="Filtriraj publikacije">
    //                     <>
    //                         <h5
    //                             onClick={handleClearFilters}
    //                             className="clearFilters"
    //                             style={{opacity: 1}}
    //                         >
    //                             Poništi sve filtere
    //                         </h5>
    //                         {/* <h3 className="filter-header">
    //                             Filtriraj publikacije
    //                         </h3> */}
    //                         <StatelessAccordion
    //                             expanded={expanded}
    //                             onChange={({ key }) => handleChange(key)}
    //                             overrides={{
    //                                 Content: {
    //                                     style: {
    //                                         paddingTop: "0.8em",
    //                                         border: "1px solid #DCDFE4",
    //                                         paddingBottom: "0.8em",
    //                                     },
    //                                 },
    //                                 Header: {
    //                                     style: {
    //                                         backgroundColor: "#F2F5F7",
    //                                         padding: "0.7em",
    //                                         paddingInline: "1em",
    //                                         fontFamily: "Barlow",
    //                                         fontWeight: "bold",
    //                                         letterSpacing: "0.04em",
    //                                     },
    //                                 },
    //                                 PanelContainer: {
    //                                     style: {
    //                                         marginBottom: "1em",
    //                                         borderBottom: "none",
    //                                     },
    //                                 },
    //                                 ToggleIcon: {
    //                                     style: {
    //                                         color: "#af4d00",
    //                                     },
    //                                 },
    //                             }}
    //                         >
    //                             <Panel key="P1" title="Oblast istraživanja">
    //                                 <ResearchSubjects />
    //                             </Panel>
    //                             <Panel key="P2" title="Tip publikacije">
    //                                 <Categories />
    //                             </Panel>
    //                             <Panel key="P3" title="Jezik">
    //                                 <Languages />
    //                             </Panel>
    //                             <Panel key="P4" title="Godina izdanja">
    //                                 <PublicationYear />
    //                             </Panel>
    //                             <Panel key="P5" title="Autor">
    //                                 <Author />
    //                             </Panel>
    //                         </StatelessAccordion>
    //                     </>
    //                 </Panel>
    //             </Accordion>
    //         </> : <>
    //             <h5 onClick={handleClearFilters} className="clearFilters">
    //                 Poništi sve filtere
    //             </h5>
    //             <h3 className="filter-header">Filtriraj publikacije</h3>
    //             <StatelessAccordion
    //                 expanded={expanded}
    //                 onChange={({ key }) => handleChange(key)}
    //                 overrides={{
    //                     Content: {
    //                         style: {
    //                             paddingTop: "0.8em",
    //                             border: "1px solid #DCDFE4",
    //                             paddingBottom: "0.8em",
    //                         },
    //                     },
    //                     Header: {
    //                         style: {
    //                             // backgroundColor: "#F2F5F7",
    //                             // backgroundColor: "rgba(139, 197, 63, 0.8)",
    //                             backgroundColor: "#F2F5F7",
    //                             // color: "white",
    //                             padding: "0.7em",
    //                             paddingInline: "1em",
    //                             // fontFamily: "Belleza",
    //                             // fontFamily: "Cantarell",
    //                             fontFamily: "Barlow",
    //                             fontWeight: "bold",
    //                             letterSpacing: "0.04em",
    //                             // fontSize: "1.05em",
    //                             // ":hover": {
    //                             //     color: "white"
    //                             // }
    //                         },
    //                     },
    //                     PanelContainer: {
    //                         style: {
    //                             marginBottom: "1em",
    //                             borderBottom: "none",
    //                         },
    //                     },
    //                     ToggleIcon: {
    //                         style: {
    //                             // color: "#8BC53F",
    //                             color: "#af4d00",
    //                         },
    //                     },
    //                 }}
    //             >
    //                 <Panel key="P1" title="Oblast istraživanja">
    //                     <ResearchSubjects />
    //                 </Panel>
    //                 <Panel key="P2" title="Tip publikacije">
    //                     <Categories />
    //                 </Panel>
    //                 <Panel key="P3" title="Jezik">
    //                     <Languages />
    //                 </Panel>
    //                 <Panel key="P4" title="Godina izdanja">
    //                     <PublicationYear />
    //                 </Panel>
    //                 <Panel key="P5" title="Autor">
    //                     <Author />
    //                 </Panel>
    //                </>
    //     </>
    // );
};

export default LiteratureFilters;
