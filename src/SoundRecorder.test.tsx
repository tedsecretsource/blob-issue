import { render, screen } from '@testing-library/react'
import 'fake-indexeddb/auto'
import SoundRecorder from './SoundRecorder'
import userEvent from '@testing-library/user-event'

const initDB = () => {
    const request = indexedDB.open('sound-recorder', 1)
    let db = null
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      db.createObjectStore('recordings', { keyPath: 'id', autoIncrement: true })
    }
    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result
      console.log('Database initialized')
    }
    request.onerror = (event) => {
      console.log('Error opening database ' + (event.target as IDBOpenDBRequest).error)
    }
    return db
}

describe('SoundRecorder', () => {
    it('should render without crashing', () => {
        render(<SoundRecorder db={initDB()} />)
    })

    it('should add a recording to the database', async () => {
        render(<SoundRecorder db={initDB()} />)
        const button = screen.getByRole('button', { name: 'Start Recording' })
        await userEvent.click(button)
        expect(button).toHaveTextContent('Stop')
    })
})
