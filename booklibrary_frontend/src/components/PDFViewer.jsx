import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
    useParams,
    useNavigate,
    useLocation,
    useNavigationType,
} from "react-router-dom";
import { useState, useEffect } from "react";
import baseEndpoint from "../utils/api";
import Loading from "./loading/Loading";
import GoBack from "./GoBack";
import "./pdfViewer.css";

const PDFViewer = ({ publicationDrawer }) => {
    const [publication, setPublication] = useState(null);
    const { publicationTitle } = useParams();
    const [accessedDirectly, setAccessedDirectly] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 800);

    const navigate = useNavigate();
    const location = useLocation();
    const navigationType = useNavigationType();

    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const topToolbarOnlyPluginInstance = defaultLayoutPlugin({
        sidebarTabs: () => [], // Disables the sidebar
    });

    useEffect(() => {
        if (document.referrer === "" && navigationType === "POP") {
            setAccessedDirectly(true);
        }
    }, [navigationType]);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 800);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!publicationDrawer) {
            const fetchData = async () => {
                try {
                    const publicationResponse = await baseEndpoint.get(
                        `biblioteka/api/literatura?title_single=${encodeURI(publicationTitle)}`
                    );
                    setPublication(publicationResponse.data.results[0]);
                    console.log(publicationResponse.data);
                    
                } catch (error) {
                    console.error(error); // Handle errors as needed
                } 
            };
            fetchData();
        }
    }, [publicationTitle]);
    

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            {publicationDrawer ? (
                <div className="pdf-viewer-modal">
                    <Viewer
                        fileUrl={publicationDrawer.pdf}
                        plugins={[topToolbarOnlyPluginInstance]}
                        renderLoader={() => <Loading />}
                    />
                </div>
            ) : publication ? (
                <div className="pdf-viewer-wrapper">
                    <div className="pdf-viewer">
                        {accessedDirectly && !location.search.endsWith("pdf") ? (
                            <GoBack
                                returnToLocation={`/${encodeURI(
                                    publication.title
                                )}`}
                                label={"Detalji o publikaciji"}
                            />
                        ) : null}
                        <Viewer
                            fileUrl={publication.pdf}
                            plugins={[
                                isSmallScreen
                                    ? topToolbarOnlyPluginInstance
                                    : defaultLayoutPluginInstance,
                            ]}
                            renderLoader={() => <Loading />}
                        />
                    </div>
                </div>
            ) : null}
        </Worker>
    );
};

export default PDFViewer;
