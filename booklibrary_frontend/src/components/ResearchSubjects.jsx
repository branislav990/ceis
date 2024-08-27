import { useContext, useEffect } from "react";
import { FilterContext } from "../contexts/FilterContext";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";

const ResearchSubjects = () => {
    const { researchSubjects, filterDispatch } = useContext(FilterContext);

    const handleChange = (index) => {
        filterDispatch({
            type: "FILTER_SUBJECTS",
            payload: {
                researchSubjects: researchSubjects.map((subject, i) =>
                    i === index
                        ? { ...subject, isChecked: !subject.isChecked }
                        : subject
                ),
            },
        });
    };  

    return (
        <div>
            {researchSubjects.map((subject, index) =>
                subject.count > 0 ? (
                    <Checkbox
                        key={index}
                        checked={subject.isChecked}
                        onChange={() => handleChange(index)}
                        labelPlacement={LABEL_PLACEMENT.right}
                        overrides={{
                            Root: {
                                style: () => ({
                                    display: "flex",
                                    alignItems: "center",
                                }),
                            },
                            Checkmark: {
                                style: ({ $theme, $isHovered }) => ({
                                    borderWidth: "1px",
                                    width: "16px",
                                    height: "16px",
                                    // width: $isHovered ? "20px" : "16px", // Adjust size if needed
                                    // height: $isHovered ? "20px" : "16px",
                                }),
                            },
                            Label: {
                                style: {
                                    fontFamily: "Barlow",
                                    fontWeight: "bold",
                                    letterSpacing: "0.03em",
                                    wordSpacing: "0.1em",
                                    fontSize: "1.1em"
                                }
                            }
                            // Label: {
                            //     style: ({ $checked }) => ({
                            //         fontWeight: $checked ? "500" : "normal",
                            //     }),
                            // },
                        }}
                    >
                        {subject.label}
                    </Checkbox>
                ) : null
            )}
        </div>
    );
};

export default ResearchSubjects;
