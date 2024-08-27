import { useContext, useEffect } from "react";
import { FilterContext } from "../contexts/FilterContext";
import { URLContext } from "../contexts/URLContext";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";

const Languages = () => {
    const { languages, filterDispatch } = useContext(FilterContext);

    const handleChange = (index) => {
        filterDispatch({
            type: "FILTER_LANGUAGES",
            payload: {
                languages: languages.map((language, i) =>
                    i === index
                        ? { ...language, isChecked: !language.isChecked }
                        : language
                ),
            },
        });
    };

    return (
        <div>
            {languages.map((language, index) =>
                language.count > 0 ? (
                    <Checkbox
                        key={index}
                        checked={language.isChecked}
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
                        }}
                    >
                        {language.labelReact}
                    </Checkbox>
                ) : null
            )}
        </div>
    );
};

export default Languages;
