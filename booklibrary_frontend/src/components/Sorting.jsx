// import { useContext, useEffect, useState } from "react";
// import { Select, SIZE } from "baseui/select";
// import "./sorting.css";
// import { FilterContext } from "../contexts/FilterContext";
// import { StatefulPopover, TRIGGER_TYPE, PLACEMENT } from "baseui/popover";
// import { ParagraphSmall } from "baseui/typography";

// const OPTIONS = [
//     { label: "Podrazumevano", queryParam: "" },
//     { label: "Naslovu", queryParam: "title" },
//     { label: "Godini izdanja", queryParam: "publication_year" },
//     { label: "Imenu prvog autora", queryParam: "author_first" },
//     { label: "Prezimenu prvog autora", queryParam: "author_last" },
// ];

// const Sorting = () => {
//     const { sorting, sortingDirection, filterDispatch } =
//         useContext(FilterContext);
//     const [value, setValue] = useState(sorting);
//     const [sortingDirectionLocal, setSortingDirectionLocal] = useState(
//         sortingDirection || "ascending"
//     );

//     useEffect(() => {
//         filterDispatch({
//             type: "UPDATE_SORTING",
//             payload: { value, sortingDirectionLocal },
//         });
//     }, [value, sortingDirectionLocal]);

//     useEffect(() => {
//         setValue(sorting);
//         setSortingDirectionLocal(sortingDirection);
//     }, [sorting, sortingDirection]);

//     return (
//         <>
//             <span className="sorting-label">Sortiraj po:</span>
//             <Select
//                 {...props}
//                 options={OPTIONS}
//                 labelKey="label"
//                 valueKey="queryParam"
//                 searchable={false}
//                 clearable={false}
//                 size={SIZE.mini}
//                 placeholder={null}
//                 onChange={({ value }) => setValue(value[0])}
//                 value={value}
//                 overrides={{
//                     Root: {
//                         style: () => ({
//                             width: "15em",
//                             marginLeft: "0.5em",
//                             marginRight: "0.5em",
//                             fontFamily: "Barlow",
//                             fontSize: "0.85em",
//                         }),
//                     },
//                     SelectArrow: {
//                         props: {
//                             title: "Otvori", // Set the custom title
//                             overrides: {
//                                 Svg: {
//                                     style: {
//                                         color: "#AF4D00",
//                                     },
//                                 },
//                             },
//                         },
//                     },
//                     ControlContainer: {
//                         style: {
//                             backgroundColor: "#F2F5F7",
//                         },
//                     },
//                     DropdownListItem: {
//                         style: {
//                             fontFamily: "Barlow",
                            
//                         }
//                     }
//                 }}
//             />
//             {value.queryParam !== "" ? (
//                 <StatefulPopover
//                     showArrow
//                     content={
//                         <ParagraphSmall
//                             paddingLeft={"0.7em"}
//                             paddingRight={"0.7em"}
//                             paddingTop={0}
//                             paddingBottom={0}
//                             marginTop={"0.3em"}
//                             marginBottom={"0.5em"}
//                             color={"white"}
//                             fontWeight={"bold"}
//                         >
//                             Obrni smer sortiranja
//                         </ParagraphSmall>
//                     }
//                     accessibilityType={"tooltip"}
//                     triggerType={TRIGGER_TYPE.hover}
//                     placement={PLACEMENT["bottomRight"]}
//                     popoverMargin={4}
//                     overrides={{
//                         Arrow: {
//                             style: ({ $theme }) => ({
//                                 backgroundColor: "#333333",
//                                 marginTop: "0",
//                             }),
//                         },
//                         Body: {
//                             style: ({ $theme }) => ({
//                                 backgroundColor: "#333333",
//                                 borderTopLeftRadius: $theme.borders.radius400,
//                                 borderTopRightRadius: $theme.borders.radius400,
//                                 borderBottomRightRadius:
//                                     $theme.borders.radius400,
//                                 borderBottomLeftRadius:
//                                     $theme.borders.radius400,
//                             }),
//                         },
//                         Inner: {
//                             style: ({ $theme }) => ({
//                                 backgroundColor: "#333333",
//                                 borderTopLeftRadius: $theme.borders.radius400,
//                                 borderTopRightRadius: $theme.borders.radius400,
//                                 borderBottomRightRadius:
//                                     $theme.borders.radius400,
//                                 borderBottomLeftRadius:
//                                     $theme.borders.radius400,
//                                 // color: $theme.colors.white,
//                             }),
//                         },
//                     }}
//                 >
//                     <img
//                         src={
//                             sortingDirectionLocal === "ascending"
//                                 ? require("../assets/sorting-ascending.png")
//                                 : require("../assets/sorting-descending.png")
//                         }
//                         alt="sorting direction"
//                         width={30}
//                         onClick={() =>
//                             setSortingDirectionLocal((prevDirection) =>
//                                 prevDirection === "ascending"
//                                     ? "descending"
//                                     : "ascending"
//                             )
//                         }
//                         // title="Obrni smer sortiranja"
//                         style={{ cursor: "pointer" }}
//                     />
//                 </StatefulPopover>
//             ) : (
//                 <span style={{ width: "30px" }}></span>
//             )}
//         </>
//     );
// };

// export default Sorting;






import { useContext, useEffect, useState } from "react";
import { Select, SIZE } from "baseui/select";
import "./sorting.css";
import { FilterContext } from "../contexts/FilterContext";
import { StatefulPopover, TRIGGER_TYPE, PLACEMENT } from "baseui/popover";
import { ParagraphSmall } from "baseui/typography";

const OPTIONS = [
    { label: "Podrazumevano", queryParam: "" },
    { label: "Naslovu", queryParam: "title" },
    { label: "Godini izdanja", queryParam: "publication_year" },
    { label: "Imenu prvog autora", queryParam: "author_first" },
    { label: "Prezimenu prvog autora", queryParam: "author_last" },
];

const Sorting = () => {
    const { sorting, sortingDirection, filterDispatch } =
        useContext(FilterContext);
    const [value, setValue] = useState(sorting);
    const [sortingDirectionLocal, setSortingDirectionLocal] = useState(
        sortingDirection || "ascending"
    );

    useEffect(() => {
        filterDispatch({
            type: "UPDATE_SORTING",
            payload: { value, sortingDirectionLocal },
        });
    }, [value, sortingDirectionLocal]);

    useEffect(() => {
        setValue(sorting);
        setSortingDirectionLocal(sortingDirection);
    }, [sorting, sortingDirection]);

    return (
        <>
            <span className="sorting-label">Sortiraj po:</span>
            <Select
                options={OPTIONS}
                labelKey="label"
                valueKey="queryParam"
                searchable={false}
                clearable={false}
                size={SIZE.mini}
                placeholder={null}
                onChange={({ value }) => setValue(value[0])}
                value={value}
                overrides={{
                    Root: {
                        style: () => ({
                            width: "15em",
                            marginLeft: "0.5em",
                            marginRight: "0.5em",
                            fontFamily: "Barlow",
                            fontSize: "0.85em",
                        }),
                    },
                    SelectArrow: {
                        props: {
                            title: "Otvori", // Set the custom title
                            overrides: {
                                Svg: {
                                    style: {
                                        color: "#AF4D00",
                                    },
                                },
                            },
                        },
                    },
                    ControlContainer: {
                        style: {
                            backgroundColor: "#F2F5F7",
                        },
                    },
                    DropdownListItem: {
                        style: {
                            fontFamily: "Barlow",
                        }
                    },
                    Input: {
                        props: {
                            onFocus: (e) => e.preventDefault(),
                            readOnly: true,
                        },
                    },
                }}
            />
            {value.queryParam !== "" ? (
                <StatefulPopover
                    showArrow
                    content={
                        <ParagraphSmall
                            paddingLeft={"0.7em"}
                            paddingRight={"0.7em"}
                            paddingTop={0}
                            paddingBottom={0}
                            marginTop={"0.3em"}
                            marginBottom={"0.5em"}
                            color={"white"}
                            fontWeight={"bold"}
                        >
                            Obrni smer sortiranja
                        </ParagraphSmall>
                    }
                    accessibilityType={"tooltip"}
                    triggerType={TRIGGER_TYPE.hover}
                    placement={PLACEMENT["bottomRight"]}
                    popoverMargin={4}
                    overrides={{
                        Arrow: {
                            style: ({ $theme }) => ({
                                backgroundColor: "#333333",
                                marginTop: "0",
                            }),
                        },
                        Body: {
                            style: ({ $theme }) => ({
                                backgroundColor: "#333333",
                                borderTopLeftRadius: $theme.borders.radius400,
                                borderTopRightRadius: $theme.borders.radius400,
                                borderBottomRightRadius:
                                    $theme.borders.radius400,
                                borderBottomLeftRadius:
                                    $theme.borders.radius400,
                            }),
                        },
                        Inner: {
                            style: ({ $theme }) => ({
                                backgroundColor: "#333333",
                                borderTopLeftRadius: $theme.borders.radius400,
                                borderTopRightRadius: $theme.borders.radius400,
                                borderBottomRightRadius:
                                    $theme.borders.radius400,
                                borderBottomLeftRadius:
                                    $theme.borders.radius400,
                            }),
                        },
                    }}
                >
                    <img
                        src={
                            sortingDirectionLocal === "ascending"
                                ? require("../assets/sorting-ascending.png")
                                : require("../assets/sorting-descending.png")
                        }
                        alt="sorting direction"
                        width={30}
                        onClick={() =>
                            setSortingDirectionLocal((prevDirection) =>
                                prevDirection === "ascending"
                                    ? "descending"
                                    : "ascending"
                            )
                        }
                        style={{ cursor: "pointer" }}
                    />
                </StatefulPopover>
            ) : (
                <span style={{ width: "30px" }}></span>
            )}
        </>
    );
};

export default Sorting;
