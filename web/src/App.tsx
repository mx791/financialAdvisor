import React from 'react';
import Menu from './components/Menu';
import LandingPage from './pages/LandingPage';
import NonePage from './pages/NonePage';
import ExplorePage from './pages/ExplorePage';
import Footer from './pages/Footer';


function App() {

  const [page, setPage] = React.useState("MAIN");
  const changePage = (i: String) => setPage(i + "");

  return (
    <div className="App">
      <Menu setActivePage={changePage}/>
      { page === "MAIN" ? (<LandingPage />) : "" }
      { page === "EXPLORE" ? (<ExplorePage />) : "" }
      { page !== "MAIN" ? (<NonePage />) : "" }
      <Footer />
    </div>
  );
}

export default App;
