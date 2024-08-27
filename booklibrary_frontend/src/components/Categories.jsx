import { useContext } from "react";
import { FilterContext } from "../contexts/FilterContext";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";

const Categories = () => {
    const { categories, filterDispatch } = useContext(FilterContext);

    const handleChange = (index) => {
        filterDispatch({
            type: "FILTER_CATEGORIES",
            payload: {
                categories: categories.map((category, i) =>
                    i === index
                        ? { ...category, isChecked: !category.isChecked }
                        : category
                ),
            },
        });
    };

    return (
        <div>
            {categories.map((category, index) =>
                category.count > 0 ? (
                    <Checkbox
                        key={index}
                        checked={category.isChecked}
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
                        {category.labelReact}
                    </Checkbox>
                ) : null
            )}
        </div>
    );
};

export default Categories;
