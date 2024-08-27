import { useNavigate } from "react-router-dom";
import { StatefulPopover, TRIGGER_TYPE, PLACEMENT } from "baseui/popover";
import { ParagraphSmall } from "baseui/typography";
import { useState, useEffect } from "react";
import "./goBack.css";

const GoBack = ({ returnToLocation, label }) => {
    const navigate = useNavigate();
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 100); // Delay added here to ensure no flash

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    return (
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
                    {label}
                </ParagraphSmall>
            }
            accessibilityType={"tooltip"}
            triggerType={TRIGGER_TYPE.hover}
            placement={PLACEMENT.right}
            popoverMargin={4}
            overrides={{
                Arrow: {
                    style: ({ $theme }) => ({
                        backgroundColor: "#333333",
                        marginTop: "0",
                        marginLeft: "0.08em",
                    }),
                },
                Body: {
                    style: ({ $theme }) => ({
                        backgroundColor: "#333333",
                        borderTopLeftRadius: $theme.borders.radius400,
                        borderTopRightRadius: $theme.borders.radius400,
                        borderBottomRightRadius: $theme.borders.radius400,
                        borderBottomLeftRadius: $theme.borders.radius400,
                        padding: 0,
                    }),
                },
                Inner: {
                    style: ({ $theme }) => ({
                        backgroundColor: "#333333",
                        borderTopLeftRadius: $theme.borders.radius400,
                        borderTopRightRadius: $theme.borders.radius400,
                        borderBottomRightRadius: $theme.borders.radius400,
                        borderBottomLeftRadius: $theme.borders.radius400,
                        padding: 0,
                    }),
                },
            }}
        >
            <div
                className={`return-to-list-wrapper ${
                    isAnimated ? "slide-in" : ""
                }`}
            >
                <div
                    className="return-to-list"
                    onClick={() => navigate(returnToLocation)}
                >
                    <img
                        src={require("../assets/back-arrow-6.png")}
                        alt="Return to list"
                        width={35}
                    />
                </div>
            </div>
        </StatefulPopover>
    );
};

export default GoBack;
