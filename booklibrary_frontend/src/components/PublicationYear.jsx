// import { Slider } from "baseui/slider";
// import { useContext, useEffect, useState, useCallback } from "react";
// import { FilterContext } from "../contexts/FilterContext";
// import { debounce } from "lodash";
// import React from "react";

// const PublicationYear = () => {
//     const { publicationYearsRange, publicationYearsDefault, filterDispatch } =
//         useContext(FilterContext);
//     const [value, setValue] = useState([
//         publicationYearsRange.minYear,
//         publicationYearsRange.maxYear,
//     ]);

//     const debouncedDispatch = useCallback(
//         debounce((value) => {
//             filterDispatch({
//                 type: "UPDATE_PUBLICATION_YEARS",
//                 payload: { value },
//             });
//         }, 800),
//         [filterDispatch]
//     );

//     useEffect(() => {
//         setValue([
//             publicationYearsRange.minYear,
//             publicationYearsRange.maxYear,
//         ]);
//     }, [publicationYearsRange]);

//     useEffect(() => {
//         debouncedDispatch(value);
//     }, [value]);

//     return (
//         <div
//             style={{
//                 position: "relative",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 textAlign: "center",
//                 marginTop: "1em",
//             }}
//         >
//             <span style={{fontFamily: "Barlow", fontWeight: "bold", letterSpacing: "0.08em", fontSize: "1.2em"}}>
//                 {value[0]} - {value[1]}
//             </span>
//             <Slider
//                 min={publicationYearsDefault.minYear}
//                 max={publicationYearsDefault.maxYear}
//                 value={value}
//                 persistentThumb
//                 onChange={({ value }) => setValue(value)}
//                 overrides={{
//                     Root: {
//                         style: {
//                             marginTop: "0.7em",
//                             marginBottom: "-0.5em",
//                         },
//                     },
//                     ThumbValue: {
//                         style: () => ({
//                             display: "none",
//                         }),
//                     },
//                     InnerThumb: {
//                         style: () => ({
//                             display: "none",
//                         }),
//                     },
//                     Thumb: {
//                         style: ({ $theme, $thumbIndex }) => ({
//                             width: "0.9em",
//                             height: "0.9em",
//                             ":focus": {
//                                 boxShadow: "none",
//                             },
//                             // backgroundColor: "white",
//                             content: $thumbIndex === 0 ? "<" : ">",
//                         }),
//                     },
//                     InnerTrack: {
//                         style: {
//                             // height: "3px",
//                             outline: "1px solid rgba(0, 0, 0, 0.3)",
//                             borderRadius: "1em",
//                             // opacity: 0.7,
//                             // ":hover": {
//                             //     opacity: 1,
//                             // },
//                         },
//                     },
//                     Tick: {
//                         style: ({ $theme }) => ({
//                             opacity: 0.5,
//                             position: "relative",
//                             // bottom: "3.5em",
//                             bottom: "0.4em",
//                             fontFamily: "Barlow",
//                             fontSize: "1.05em"
//                         }),
//                     },
//                 }}
//             />
            
//         </div>
//     );
// };

// export default PublicationYear;























import { Slider } from "baseui/slider";
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../contexts/FilterContext";
import React from "react";

const PublicationYear = () => {
    const { publicationYearsRange, publicationYearsDefault, filterDispatch } =
        useContext(FilterContext);
    const [value, setValue] = useState([
        publicationYearsRange.minYear,
        publicationYearsRange.maxYear,
    ]);

    useEffect(() => {
        setValue([
            publicationYearsRange.minYear,
            publicationYearsRange.maxYear,
        ]);
    }, [publicationYearsRange]);

    const handleFinalChange = (newValue) => {
        filterDispatch({
            type: "UPDATE_PUBLICATION_YEARS",
            payload: { value: newValue },
        });
    };

    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                marginTop: "1em",
            }}
        >
            <span style={{fontFamily: "Barlow", fontWeight: "bold", letterSpacing: "0.08em", fontSize: "1.2em"}}>
                {value[0]} - {value[1]}
            </span>
            <Slider
                min={publicationYearsDefault.minYear}
                max={publicationYearsDefault.maxYear}
                value={value}
                persistentThumb
                onChange={({ value }) => setValue(value)}
                onFinalChange={({ value }) => handleFinalChange(value)}
                overrides={{
                    Root: {
                        style: {
                            marginTop: "0.7em",
                            marginBottom: "-0.5em",
                        },
                    },
                    ThumbValue: {
                        style: () => ({
                            display: "none",
                        }),
                    },
                    InnerThumb: {
                        style: () => ({
                            display: "none",
                        }),
                    },
                    Thumb: {
                        style: ({ $thumbIndex }) => ({
                            width: "0.9em",
                            height: "0.9em",
                            ":focus": {
                                boxShadow: "none",
                            },
                            content: $thumbIndex === 0 ? "<" : ">",
                        }),
                    },
                    InnerTrack: {
                        style: {
                            outline: "1px solid rgba(0, 0, 0, 0.3)",
                            borderRadius: "1em",
                        },
                    },
                    Tick: {
                        style: {
                            opacity: 0.5,
                            position: "relative",
                            bottom: "0.4em",
                            fontFamily: "Barlow",
                            fontSize: "1.05em"
                        },
                    },
                }}
            />
        </div>
    );
};

export default PublicationYear;
