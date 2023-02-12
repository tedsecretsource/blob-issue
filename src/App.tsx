import React, { useEffect, useState } from 'react';
import './App.css';
import SoundRecorder from './SoundRecorder';

function App() {
  const [db, setDb] = useState<IDBDatabase | null>(null)

  useEffect(() => {
    // initialize the database
    const request = indexedDB.open('sound-recorder', 1)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      db.createObjectStore('recordings', { keyPath: 'id', autoIncrement: true })
    }
    request.onsuccess = (event) => {
      setDb((event.target as IDBOpenDBRequest).result)
      console.log('Database initialized', db)
    }
    request.onerror = (event) => {
      console.log('Error opening database ' + (event.target as IDBOpenDBRequest).error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App">
      <SoundRecorder db={db} />
    </div>
  );
}

export default App;
