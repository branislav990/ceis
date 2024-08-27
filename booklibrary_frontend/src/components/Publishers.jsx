import { Select, TYPE } from "baseui/select";
import { useContext, useState } from "react";
import { FilterContext } from "../contexts/FilterContext";

const Publishers = () => {
    const { publishers } = useContext(FilterContext);
    const [value, setValue] = useState([]);
    // const options = [];
    // publishers.forEach(publisher => options.push(publisher))
    const options = publishers.map(publisher => ({ publisher }));


    return (
        <div>
            <Select
                options={options}
                labelKey="publisher"
                valueKey="publisher"
                placeholder="Izaberi izdavača"
                maxDropdownHeight="300px"
                type={TYPE.search}
                multi
                onChange={({ value }) => setValue(value)}
                value={value}
            />
        </div>
    );
};

export default Publishers;
