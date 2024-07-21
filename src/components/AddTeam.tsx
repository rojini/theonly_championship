import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';

interface Player {
  name: string;
  birthdate: string;
  height: number;
  position: string;
}

function AddTeams() {
  const [teamName, setTeamName] = useState('');
  const [location, setLocation] = useState('');
  const [coach, setCoach] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Player>({
    name: '',
    birthdate: '',
    height: 0,
    position: 'PG' // 기본값을 'PG'로 설정
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [teamId, setTeamId] = useState<string>('');

  const handleAddPlayer = () => {
    if (selectedPlayerIndex !== null) {
      // Update existing player
      const updatedPlayers = [...players];
      updatedPlayers[selectedPlayerIndex] = newPlayer;
      setPlayers(updatedPlayers);
      setSelectedPlayerIndex(null);
    } else {
      // Add new player
      setPlayers([...players, newPlayer]);
    }
    setNewPlayer({
      name: '',
      birthdate: '',
      height: 0,
      position: 'PG' // 기본값을 'PG'로 설정
    });
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Add team to Firestore and get the team ID
      const teamDocRef = await addDoc(collection(db, 'teams'), {
        name: teamName,
        location,
        coach
      });
      setTeamId(teamDocRef.id); // Save the team ID

      // Add players to Firestore
      const playerCollectionRef = collection(db, 'players');
      for (const player of players) {
        await addDoc(playerCollectionRef, {
          ...player,
          teamId: teamDocRef.id // Associate player with team ID
        });
      }

      setTeamName('');
      setLocation('');
      setCoach('');
      setPlayers([]);
      alert('Team and players added successfully!');
    } catch (err) {
      console.error('Error adding team: ', err);
      alert('Error adding team');
    }
  };

  const handleEditPlayer = (index: number) => {
    setNewPlayer(players[index]);
    setSelectedPlayerIndex(index);
    setShowModal(true);
  };

  return (
    <div className="mt-5">
      <h2>Add Team</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="team-name">Team Name:</label>
          <input 
            type="text" 
            className="form-control" 
            id="team-name" 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input 
            type="text" 
            className="form-control" 
            id="location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="coach">Coach:</label>
          <input 
            type="text" 
            className="form-control" 
            id="coach" 
            value={coach} 
            onChange={(e) => setCoach(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group mt-3">
          <Button variant="secondary" onClick={() => setShowModal(true)}>
            Add/Edit Player
          </Button>
        </div>
        <ListGroup className="mt-3">
          {players.map((player, index) => (
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
        <button type="submit" className="btn btn-primary mt-3">Add Team</button>
      </form>

      {/* Modal component */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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

export default AddTeams;