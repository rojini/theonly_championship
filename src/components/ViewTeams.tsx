import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Team {
  id: string;
  name: string;
  location: string;
  coach: string;
  players: any[];
}

function ViewTeams() {
  const [teams, setTeams] = useState<Team[]>([]);

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

  return (
    <div className="mt-5">
      <h2>Teams</h2>
      <ListGroup>
        {teams.map(team => (
          <ListGroup.Item key={team.id}>
            <Link to={`/team/${team.id}`} className="text-decoration-none">
              {team.name}
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default ViewTeams;