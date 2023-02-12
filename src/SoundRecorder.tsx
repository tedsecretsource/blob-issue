import { useState } from 'react'

interface SoundRecorderProps {
    db: IDBDatabase | null
}

const SoundRecorder = (props: SoundRecorderProps) => {
    const db = props.db
    const [buttonName, setButtonName] = useState('Start Recording')

    const initRecording = () => {
        db?.transaction('recordings', 'readwrite')
        .objectStore('recordings')
        .add({ name: 'Empty Recording', length: 0, audioURL: '', data: new Blob() })
        setButtonName('Stop Recording')
    }

    return (
        <div>
            <h1>Sound Recorder</h1>
            <p>Database: {props.db?.name}</p>
            <button onClick={initRecording}>{buttonName}</button>
        </div>
    )
}

export default SoundRecorder