import { useEffect, useState } from 'react'

interface SoundRecorderProps {
    db: IDBDatabase | null
}

const SoundRecorder = (props: SoundRecorderProps) => {
    const db = props.db
    const [buttonName, setButtonName] = useState('DB Uninitialized')
    const [recordingKey, setRecordingKey] = useState(0)

    useEffect(() => {
        if( db ) {
            setButtonName('Start Recording')
        }
    }, [db])

    const toggleRecording = () => {
        if( buttonName === 'Start Recording' ) {
            const objectStore = db?.transaction('recordings', 'readwrite').objectStore('recordings')
            if( !objectStore ) return
            
            const request = objectStore.add({ name: 'Empty Recording', length: 0, audioURL: '', data: new Blob() })
            if( !request ) return
            
            request.onsuccess = (event) => {
                setRecordingKey((event.target as IDBRequest).result)
                setButtonName('Stop Recording')
            }

            request.onerror = (event) => {
                console.log('Error adding recording', (event.target as IDBRequest).error)
            }
            
        } else {
            const objectStore = db?.transaction('recordings', 'readwrite').objectStore('recordings')
            if( !objectStore ) return

            const request = objectStore.get(recordingKey)
            if( !request ) return
            
            request.onerror = (event) => {
                console.log('Error getting recording', (event.target as IDBRequest).error)
            }
            
            request.onsuccess = (event) => {
                const data = (event.target as IDBRequest).result
                console.log('Got recording', data)
                
                // add mocked audio data to the recording
                data.data = new Blob([new Uint8Array(1000)], { type: 'audio/wav' })
                const requestUpdate = objectStore.put(data)
                if( !requestUpdate ) return
                
                requestUpdate.onerror = (event) => {
                    console.log('Error updating recording', (event.target as IDBRequest).error)
                }
                
                requestUpdate.onsuccess = (event) => {
                    console.log('Updated recording', (event.target as IDBRequest).result)
                    setButtonName('Start Recording')
                }
            }
        }
    }

    return (
        <div>
            <h1>Sound Recorder</h1>
            <p>Database: {props.db?.name}</p>
            <button onClick={toggleRecording}>{buttonName}</button>
        </div>
    )
}

export default SoundRecorder