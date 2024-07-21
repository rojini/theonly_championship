import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Container, ListGroup, Card } from 'react-bootstrap';

interface Player {
  id: string;
  name: string;
  birthdate: string;
  height: number;
  position: string;
  teamId: string; // Added to show which team the player belongs to
}

const ViewPlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<{ [key: string]: string }>({}); // To map teamId to team name

  useEffect(() => {
    // Fetch all players
    const fetchPlayers = async () => {
      const playerCollection = collection(db, 'players');
      const playerSnapshot = await getDocs(playerCollection);
      const playerList = playerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Player, 'id'>
      }));
      setPlayers(playerList);
    };

    // Fetch all teams to map teamId to team names
    const fetchTeams = async () => {
      const teamCollection = collection(db, 'teams');
      const teamSnapshot = await getDocs(teamCollection);
      const teamList = teamSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        acc[doc.id] = data.name;
        return acc;
      }, {} as { [key: string]: string });
      setTeams(teamList);
    };

    fetchPlayers();
    fetchTeams();
  }, []);

  return (
    <Container>
      <h1>View All Players</h1>
      <ListGroup className="mt-3">
        {players.map((player) => (
          <ListGroup.Item key={player.id}>
            <Card>
              <Card.Body>
                <Card.Title>{player.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Team: {teams[player.teamId] || 'Unknown Team'}
                </Card.Subtitle>
                <Card.Text>
                  Birthdate: {player.birthdate}<br />
                  Height: {player.height} cm<br />
                  Position: {player.position}
                </Card.Text>
              </Card.Body>
            </Card>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default ViewPlayers;