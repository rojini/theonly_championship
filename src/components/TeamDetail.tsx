import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';

interface Player {
  name: string;
  birthdate: string;
  height: number;
  position: string;
}

interface Team {
  id: string;
  name: string;
  location: string;
  coach: string;
  players: Player[];
}

function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (!id) {
      console.error('No team ID provided');
      return;
    }

    const fetchTeam = async () => {
      try {
        const teamDoc = doc(db, 'teams', id);
        const teamSnapshot = await getDoc(teamDoc);
        if (teamSnapshot.exists()) {
          setTeam(teamSnapshot.data() as Team);
        } else {
          console.error('No such team!');
        }
      } catch (err) {
        console.error('Error fetching team: ', err);
      }
    };

    fetchTeam();
  }, [id]);

  if (!team) return <div>Loading...</div>;

  return (
    <div className="mt-5">
      <h2>Team Detail</h2>
      <Card>
        <Card.Body>
          <Card.Title>{team.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Location: {team.location}</Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">Coach: {team.coach}</Card.Subtitle>
          <Card.Text>
            <strong>Players:</strong>
            <ul>
              {team.players.map((player, index) => (
                <li key={index}>
                  {player.name} - {player.position} ({player.height} cm)
                </li>
              ))}
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TeamDetail;