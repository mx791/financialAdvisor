import React from 'react';
import ExplorePage from './pages/ExplorePage';

import Menu from './components/Menu';
import LandingPage from './pages/LandingPage';
import NonePage from './pages/NonePage';
import Footer from './pages/Footer';
import ComposePage from './pages/ComposePage';



function App() {

  const [page, setPage] = React.useState("MAIN");
  const changePage = (i: String) => setPage(i + "");
  const implemented = ["MAIN", "EXPLORE", "COMPOSE"];

  React.useEffect(() => {
    document.title = "Financial Advisor"
  }, []);

  return (
    <div className="App">
      <Menu setActivePage={changePage}/>
      <div style={{minHeight: "80vh"}}>
        { page === "MAIN" ? (<LandingPage />) : "" }
        { page === "EXPLORE" ? (<ExplorePage />) : "" }
        { page === "COMPOSE" ? (<ComposePage />) : "" }
        { !implemented.includes(page) ? (<NonePage />) : "" }
      </div>
      <Footer />
    </div>
  );
  // return (<ExplorePage />)
}

export default App;
