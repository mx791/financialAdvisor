import React from 'react';
import Menu from './components/Menu';
import LandingPage from './pages/LandingPage';
import NonePage from './pages/NonePage';
import ExplorePage from './pages/ExplorePage';
import Footer from './pages/Footer';


function App() {

  const [page, setPage] = React.useState("MAIN");
  const changePage = (i: String) => setPage(i + "");
  const implemented = ["MAIN", "EXPLORE"];

  React.useEffect(() => {
    document.title = "Financial Advisor"
  }, []);

  return (
    <div className="App">
      <Menu setActivePage={changePage}/>
      <div style={{minHeight: "80vh"}}>
        { page === "MAIN" ? (<LandingPage />) : "" }
        { page === "EXPLORE" ? (<ExplorePage />) : "" }
        { !implemented.includes(page) ? (<NonePage />) : "" }
      </div>
      <Footer />
    </div>
  );
}

export default App;
