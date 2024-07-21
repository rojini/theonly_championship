import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { Card, ListGroup } from 'react-bootstrap';

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
  players: string[];
}

interface Championship {
  id: string;
  name: string;
  organizer: string;
  host: string;
  teams: string[]; // 참가팀 정보
}

function ChampionshipDetail() {
  const { id } = useParams<{ id: string }>();
  const [Championship, setChampionship] = useState<Championship | null>(null);

  useEffect(() => {
    if (!id) {
      console.error('No championship ID provided');
      return;
    }

    const fetchChampionship = async () => {
      try {
        const ChampionshipDoc = doc(db, 'championships', id);
        const ChampionshipSnapshot = await getDoc(ChampionshipDoc);
        if (ChampionshipSnapshot.exists()) {
          // 데이터 타입 확인
          const data = ChampionshipSnapshot.data() as Championship;
          if (Array.isArray(data.teams)) {
            setChampionship(data);
          } else {
            console.error('Invalid data format for participatingTeams');
          }
        } else {
          console.error('No such championship!');
        }
      } catch (err) {
        console.error('Error fetching championship: ', err);
      }
    };

    fetchChampionship();
  }, [id]);

  if (!Championship) return <div>Loading...</div>;

  return (
    <div className="mt-5">
      <h2>Championship Detail</h2>
      <Card>
        <Card.Body>
          <Card.Title>{Championship.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Organizer: {Championship.organizer}</Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">Host: {Championship.host}</Card.Subtitle>
          <Card.Text>
            <strong>Participating Teams:</strong>
            <ListGroup>
              {(Championship.teams || []).map((team) => (
                <ListGroup.Item key={team}>
                  <Link to={`/team/${team}`} className="text-decoration-none">
                    {team}
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ChampionshipDetail;