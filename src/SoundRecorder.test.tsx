import { act, render, screen } from '@testing-library/react'
import 'fake-indexeddb/auto'
import SoundRecorder from './SoundRecorder'
import userEvent from '@testing-library/user-event'

const initDB = async () => {
    const request = indexedDB.open('sound-recorder', 1)

    return new Promise((resolve, reject) => {
        request.onupgradeneeded = (event) => {
            const db: IDBDatabase = (event.target as IDBOpenDBRequest).result
            const objectStore = db.createObjectStore('recordings', { keyPath: 'id', autoIncrement: true })
            objectStore.transaction.oncomplete = () => {
                console.log('Object store created')
            }
        }

        request.onsuccess = (event) => {
            console.log('Test Database initialized', (event.target as IDBOpenDBRequest).result)
            resolve((event.target as IDBOpenDBRequest).result)
        }

        request.onerror = (event) => {
            console.log('Error opening test database ' + (event.target as IDBOpenDBRequest).error)
            reject()
        }
    })
}

describe('SoundRecorder', () => {

    it('should render without crashing', () => {
        initDB().then((db) => {
            render(<SoundRecorder db={db as unknown as IDBDatabase} />)
        })
    })

    it('should add a recording to the database', async () => {
        await initDB().then((db) => {
            render(<SoundRecorder db={db as unknown as IDBDatabase} />)
        })
        const button = screen.getByRole('button', { name: 'Start Recording' })
        await userEvent.click(button)
        expect(button).toHaveTextContent('Stop')
    })
    
    it('should update an existing recording and stop recording', async () => {
        await initDB().then((db) => {
            render(<SoundRecorder db={db as unknown as IDBDatabase} />)
        })
        const button = screen.getByRole('button', { name: 'Start Recording' })
        await userEvent.click(button)
        expect(button).toHaveTextContent('Stop')
        await userEvent.click(button)
        expect(button).toHaveTextContent('Start Recording')
    })
})
