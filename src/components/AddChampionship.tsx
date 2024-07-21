import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, collection, addDoc, getDocs, updateDoc, DocumentData } from 'firebase/firestore';
import { Button, Form, Modal, ListGroup } from 'react-bootstrap';

// 팀 및 선수 인터페이스
interface Team {
  id: string;
  name: string;
  location: string;
  coach: string;
  players: Array<{
    name: string;
    birthdate: string;
    height: number;
    position: string;
  }>;
}

interface Player {
  name: string;
  birthdate: string;
  height: number;
  position: string;
}

function AddChampionship() {
  const [name, setName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [host, setHost] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newTeam, setNewTeam] = useState<{ name: string; location: string; coach: string; players: Player[] }>({
    name: '',
    location: '',
    coach: '',
    players: []
  });
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [newPlayer, setNewPlayer] = useState<Player>({
    name: '',
    birthdate: '',
    height: 0,
    position: ''
  });
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null); // 현재 선택된 팀 ID


  // 대회 정보를 제출하는 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'championships'), {
        name,
        organizer,
        host,
        dateRange,
        teams: selectedTeams // 선택한 팀 목록 저장
      });
      setName('');
      setOrganizer('');
      setHost('');
      setDateRange({ start: '', end: '' });
      setSelectedTeams([]);
      alert('Championship added successfully!');
    } catch (err) {
      console.error('Error adding championship: ', err);
      alert('Error adding championship');
    }
  };

  // 팀을 추가하는 함수
  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.location || !newTeam.coach || newTeam.players.length === 0) return;

    try {
      const teamRef = await addDoc(collection(db, 'teams'), {
        name: newTeam.name,
        location: newTeam.location,
        coach: newTeam.coach,
        players: newTeam.players
      });
      const newTeamData: Team = {
        id: teamRef.id,
        name: newTeam.name,
        location: newTeam.location,
        coach: newTeam.coach,
        players: newTeam.players
      };
      setTeams(prev => [...prev, newTeamData]);
      setSelectedTeams(prev => [...prev, teamRef.id]); // 새 팀을 선택된 팀 목록에 추가
      setNewTeam({
        name: '',
        location: '',
        coach: '',
        players: []
      });
      setSelectedTeamId(teamRef.id); // 새 팀 추가 후 선택된 팀 ID 설정
      setShowTeamModal(false);

      // Add Player 모달 초기화
      setNewPlayer({
        name: '',
        birthdate: '',
        height: 0,
        position: ''
      });
      setSelectedPlayerIndex(null);
      setShowPlayerModal(false);

      alert('Team added successfully!');
    } catch (err) {
      console.error('Error adding team: ', err);
      alert('Error adding team');
    }
  };


  // 선수를 추가하거나 수정하는 함수
  const handleAddPlayer = async () => {
    if (selectedTeamId === null) {
      alert('Please select a team first.');
      return;
    }

    const updatedPlayers = [...newTeam.players];

    if (selectedPlayerIndex !== null) {
      // 기존 선수를 수정
      updatedPlayers[selectedPlayerIndex] = newPlayer;
    } else {
      // 새 선수를 추가
      updatedPlayers.push(newPlayer);
    }

    // 팀 문서 업데이트
    try {
      const teamDocRef = doc(db, 'teams', selectedTeamId);
      await updateDoc(teamDocRef, { players: updatedPlayers });

      setNewTeam(prev => ({ ...prev, players: updatedPlayers }));
      setNewPlayer({
        name: '',
        birthdate: '',
        height: 0,
        position: ''
      });
      setSelectedPlayerIndex(null);
      setShowPlayerModal(false);

      alert('Player added/updated successfully!');
    } catch (err) {
      console.error('Error adding/updating player: ', err);
      alert('Error adding/updating player');
    }
  };

  // 선수를 수정하는 함수
  const handleEditPlayer = (index: number) => {
    setNewPlayer(newTeam.players[index]);
    setSelectedPlayerIndex(index);
    setShowPlayerModal(true);
  };


  // 팀 목록을 가져오는 함수
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsCollection = collection(db, 'teams');
        const teamsSnapshot = await getDocs(teamsCollection);
        const teamsList = teamsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Team));
        setTeams(teamsList);
      } catch (err) {
        console.error('Error fetching teams: ', err);
      }
    };

    fetchTeams();
  }, []);

  // 팀 검색 기능
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-5">
      <h2>Add Championship</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Championship Name:</label>
          <input 
            type="text" 
            className="form-control" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="organizer">Organizer:</label>
          <input 
            type="text" 
            className="form-control" 
            id="organizer" 
            value={organizer} 
            onChange={(e) => setOrganizer(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="host">Host:</label>
          <input 
            type="text" 
            className="form-control" 
            id="host" 
            value={host} 
            onChange={(e) => setHost(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="start-date">Start Date:</label>
          <input 
            type="date" 
            className="form-control" 
            id="start-date" 
            value={dateRange.start} 
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="end-date">End Date:</label>
          <input 
            type="date" 
            className="form-control" 
            id="end-date" 
            value={dateRange.end} 
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="team-select">Search Teams:</label>
          <input 
            type="text" 
            className="form-control" 
            id="team-search" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search teams by name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="team-select">Select Teams:</label>
          <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #ced4da', borderRadius: '.25rem' }}>
            <ListGroup>
              {filteredTeams.map(team => (
                <ListGroup.Item 
                  key={team.id} 
                  action 
                  active={selectedTeams.includes(team.id)} 
                  onClick={() => {
                    setSelectedTeams(prev => 
                      prev.includes(team.id) 
                        ? prev.filter(id => id !== team.id) 
                        : [...prev, team.id]
                    );
                  }}
                >
                  {team.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
        <div className="form-group mt-3">
          <Button variant="secondary" onClick={() => setShowTeamModal(true)}>
            Add New Team
          </Button>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Add Championship</button>
      </form>

      {/* 팀 추가 모달 */}
      <Modal show={showTeamModal} onHide={() => setShowTeamModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="new-team-name">
              <Form.Label>Team Name:</Form.Label>             
              <Form.Control 
                type="text" 
                placeholder="Enter team name" 
                value={newTeam.name} 
                onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))} 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="new-team-location">
              <Form.Label>Location:</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter location" 
                value={newTeam.location} 
                onChange={(e) => setNewTeam(prev => ({ ...prev, location: e.target.value }))} 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="new-team-coach">
              <Form.Label>Coach:</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter coach name" 
                value={newTeam.coach} 
                onChange={(e) => setNewTeam(prev => ({ ...prev, coach: e.target.value }))} 
              />
            </Form.Group>
            <div className="form-group mt-3">
              <Button variant="secondary" onClick={() => setShowPlayerModal(true)}>
                Add/Edit Player
              </Button>
            </div>
            <ListGroup className="mt-3">
              {newTeam.players.map((player, index) => (
                <ListGroup.Item key={index}>
                  {player.name} - {player.position} 
                  <Button 
                    variant="link" 
                    onClick={() => handleEditPlayer(index)}
                    className="float-end"
                  >
                    Edit
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button variant="primary" onClick={handleAddTeam} className="mt-3">
              Save Team
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 선수 추가 모달 */}
      <Modal show={showPlayerModal} onHide={() => setShowPlayerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedPlayerIndex !== null ? 'Edit Player' : 'Add Player'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="player-name">
              <Form.Label>Name:</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter player name" 
                value={newPlayer.name} 
                onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))} 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="player-birthdate">
              <Form.Label>Birthdate:</Form.Label>
              <Form.Control 
                type="date" 
                placeholder="Enter player birthdate" 
                value={newPlayer.birthdate} 
                onChange={(e) => setNewPlayer(prev => ({ ...prev, birthdate: e.target.value }))} 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="player-height">
              <Form.Label>Height (cm):</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Enter player height" 
                value={newPlayer.height} 
                onChange={(e) => setNewPlayer(prev => ({ ...prev, height: +e.target.value }))} 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="player-position">
              <Form.Label>Position:</Form.Label>
              <Form.Control 
                as="select"
                value={newPlayer.position} 
                onChange={(e) => setNewPlayer(prev => ({ ...prev, position: e.target.value }))} 
              >
                <option value="PG">PG</option>
                <option value="SG">SG</option>
                <option value="SF">SF</option>
                <option value="PF">PF</option>
                <option value="C">C</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleAddPlayer}>
              {selectedPlayerIndex !== null ? 'Update Player' : 'Add Player'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddChampionship;