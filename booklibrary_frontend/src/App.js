// import "./App.css";
// import LiteratureList from "./components/LiteratureList";
// import PublicationDetail from "./components/PublicationDetail";
// import Header from "./components/Header";
// import FilterContextProvider from "./contexts/FilterContext";
// import URLContextProvider from "./contexts/URLContext";
// import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";

// // BASE WEB
// import { Client as Styletron } from "styletron-engine-monolithic";
// import { Provider as StyletronProvider } from "styletron-react";
// import { LightTheme, BaseProvider } from "baseui";
// import PDFViewer from "./components/PDFViewer";
// /////////////////////////

// const engine = new Styletron();

// function App() {
//     return (
//         <div className="global-wrapper">
//             <Header />
//             <StyletronProvider value={engine}>
//                 <BaseProvider theme={LightTheme}>
//                     <URLContextProvider>
//                         <FilterContextProvider>
//                             <Router>
//                                 <Routes>
//                                     <Route
//                                         path="/:publicationTitle"
//                                         element={<PublicationDetail />}
//                                     />
//                                     <Route
//                                         path="/"
//                                         element={<LiteratureList />}
//                                     />
//                                     <Route
//                                         path="/:publicationTitle/pdf"
//                                         element={<PDFViewer />}
//                                     />
//                                 </Routes>
//                                 {/* <div className="library-wrapper">
//                                     <LiteratureList />
//                                 </div> */}
//                             </Router>
//                         </FilterContextProvider>
//                     </URLContextProvider>
//                 </BaseProvider>
//             </StyletronProvider>
//         </div>
//     );
// }

// export default App;






import "./App.css";
import LiteratureList from "./components/LiteratureList";
import PublicationDetail from "./components/PublicationDetail";
import Header from "./components/Header";
import FilterContextProvider from "./contexts/FilterContext";
import URLContextProvider from "./contexts/URLContext";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

// BASE WEB
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";
import PDFViewer from "./components/PDFViewer";
/////////////////////////

const engine = new Styletron();

const App = () => {
    return (
        <div className="global-wrapper">
            <StyletronProvider value={engine}>
                <BaseProvider theme={LightTheme}>
                    <URLContextProvider>
                        <FilterContextProvider>
                            <Router>
                                <MainContent />
                            </Router>
                        </FilterContextProvider>
                    </URLContextProvider>
                </BaseProvider>
            </StyletronProvider>
        </div>
    );
};

const MainContent = () => {
    const location = useLocation();
    const isPDFViewer = location.pathname.includes("/pdf");

    return (
        <>
            {!isPDFViewer && <Header />}
            <Routes>
                <Route path="/:publicationTitle" element={<PublicationDetail />} />
                <Route path="/" element={<LiteratureList />} />
                <Route path="/:publicationTitle/pdf" element={<PDFViewer />} />
            </Routes>
        </>
    );
};

export default App;
