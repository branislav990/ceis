import axios from "axios";

const baseEndpoint = axios.create({
    baseURL: "http://localhost:8000",
});

export default baseEndpoint;