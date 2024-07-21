import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Championship {
  id: string;
  name: string;
  organizer: string;
  host: string;
  duration: string;
}

function ViewChampionship() {
  const [Championships, setChampionships] = useState<Championship[]>([]);

  useEffect(() => {
    const fetchChampionships = async () => {
      try {
        const ChampionshipsCollection = collection(db, 'championships');
        const ChampionshipsSnapshot = await getDocs(ChampionshipsCollection);
        const ChampionshipsList = ChampionshipsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Championship));
        setChampionships(ChampionshipsList);
      } catch (err) {
        console.error('Error fetching championships: ', err);
      }
    };

    fetchChampionships();
  }, []);

  return (
    <div className="mt-5">
      <h2>Championships</h2>
      <ListGroup>
        {Championships.map(championship => (
          <ListGroup.Item key={championship.id}>
            <Link to={`/championship/${championship.id}`} className="text-decoration-none">
              {championship.name}
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default ViewChampionship;