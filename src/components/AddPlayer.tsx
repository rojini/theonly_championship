import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Button, Form, Container, ListGroup } from 'react-bootstrap';

interface Player {
  name: string;
  birthdate: string;
  height: number;
  position: string;
}

interface Team {
  id: string;
  name: string;
}

const AddPlayer = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [playerName, setPlayerName] = useState('');
  const [playerBirthdate, setPlayerBirthdate] = useState('');
  const [playerHeight, setPlayerHeight] = useState<number>(0);
  const [playerPosition, setPlayerPosition] = useState('PG');
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamCollection = collection(db, 'teams');
      const teamSnapshot = await getDocs(teamCollection);
      const teamList = teamSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setTeams(teamList);
    };

    fetchTeams();
  }, []);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeamId) {
      alert('Please select a team.');
      return;
    }

    try {
      await addDoc(collection(db, 'players'), {
        name: playerName,
        birthdate: playerBirthdate,
        height: playerHeight,
        position: playerPosition,
        teamId: selectedTeamId // Associate player with team ID
      });
      setPlayerName('');
      setPlayerBirthdate('');
      setPlayerHeight(0);
      setPlayerPosition('PG');
      alert('Player added successfully!');
    } catch (error) {
      console.error('Error adding player: ', error);
      alert('Error adding player');
    }
  };

  return (
    <Container>
      <h1>Add Player</h1>
      <Form onSubmit={handleAddPlayer}>
        <Form.Group controlId="teamSelect">
          <Form.Label>Select Team</Form.Label>
          <Form.Control
            as="select"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            required
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="playerName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="playerBirthdate">
          <Form.Label>Birthdate</Form.Label>
          <Form.Control
            type="date"
            value={playerBirthdate}
            onChange={(e) => setPlayerBirthdate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="playerHeight">
          <Form.Label>Height (cm)</Form.Label>
          <Form.Control
            type="number"
            value={playerHeight}
            onChange={(e) => setPlayerHeight(+e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="playerPosition">
          <Form.Label>Position</Form.Label>
          <Form.Control
            as="select"
            value={playerPosition}
            onChange={(e) => setPlayerPosition(e.target.value)}
            required
          >
            <option value="PG">PG</option>
            <option value="SG">SG</option>
            <option value="SF">SF</option>
            <option value="PF">PF</option>
            <option value="C">C</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">Add Player</Button>
      </Form>
    </Container>
  );
};

export default AddPlayer;