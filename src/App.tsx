import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import ViewChampionships from './components/ViewChampionships';
import AddChampionship from './components/AddChampionship';
import ViewTeams from './components/ViewTeams';
import AddTeam from './components/AddTeam';
import TeamDetail from './components/TeamDetail';
import ChampionshipDetail from './components/ChampionshipDetail';
import AddPlayer from './components/AddPlayer';
import ViewPlayers from './components/ViewPlayers';

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">Home</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/championships/view">View Championships</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/championships/add">Add Championship</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams/view">View Teams</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams/add">Add Team</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/players/view">View Players</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/players/add">Add Player</Link>
              </li>
            </ul>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/championships/view" element={<ViewChampionships />} />
          <Route path="/championships/add" element={<AddChampionship />} />
          <Route path="/championship/:id" element={<ChampionshipDetail />} />
          <Route path="/teams/view" element={<ViewTeams />} />
          <Route path="/teams/add" element={<AddTeam />} />
          <Route path="/team/:id" element={<TeamDetail />} />
          <Route path="/players/view" element={<ViewPlayers />} />
          <Route path="/players/add" element={<AddPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;