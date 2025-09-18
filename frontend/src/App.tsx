import { useEffect, useState } from 'react'
import { Link } from '@chakra-ui/react'
import { createAppliance, getAppliances, deleteAppliance, type Appliance} from './api';
import './App.css'
import { LuExternalLink } from 'react-icons/lu';

function App() {
    // Returns a stateful value, and a function to update it.
    const [appliances, setAppliances] = useState<Appliance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newAppliance, setNewAppliance] = useState<Partial<Appliance>>({});
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        getAppliances()
            .then(data => {
                setAppliances(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);
    
    if (loading) return <p>Loading appliances...</p>;
    if (error) return <p style={{color:"red"}}>Error: {error}</p>

    return (
        <div style={{padding: "1rem"}}>
            <h1>Appliances</h1>
            {appliances.length === 0 ? (
                <p>no appliances found</p>
            ) : (
                <ul>
                    {appliances.map(a => (
                        <li key={a.id}>
                            <strong>{a.model}</strong> - {a.macAddress} - {a.serial} (FW {a.fwVersion}) - Last TE Link: <Link href={a.testExecution} colorPalette="teal" target='_blank'>{a.testExecution}<LuExternalLink /></Link> - US Link: <Link href={a.userStory} colorPalette="teal" target='_blank'>{a.userStory} <LuExternalLink /></Link>  
                            <button style={{marginLeft:"1rem"}} onClick={ async () => {
                                try {
                                    await deleteAppliance(a.id);
                                    setAppliances(appliances.filter(ap => ap.id !== a.id))
                                }catch (e) {
                                    setError((e as Error).message);
                                }
                            }}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
            <button style={{margin: "1rem"} } onClick={()=> setCreating(true)}>+ Add appliance</button>
            {creating && (
                <form
                    onSubmit={async e => {
                        e.preventDefault();
                        try {
                            const created = await createAppliance(newAppliance);
                            setAppliances([created, ...appliances]);
                            setCreating(false);
                            setNewAppliance({});
                        } catch (e) {
                            setError((e as Error).message);
                        }
                    }}
                    style={{marginBottom: "1rem"}}
                >
                    <input placeholder='Model'value={newAppliance.model || ""} required
                    onChange={e => setNewAppliance({...newAppliance, model: e.target.value})}/>
                    <input placeholder='MAC'value={newAppliance.macAddress || ""} required
                    onChange={e => setNewAppliance({...newAppliance, macAddress: e.target.value})}/>
                    <input placeholder='Serial Number'
                    onChange={e => setNewAppliance({...newAppliance, serial: e.target.value})}/>
                    <input placeholder='FW Version'
                    onChange={e => setNewAppliance({...newAppliance, fwVersion: e.target.value})}/>
                    <input placeholder='TestExe link'
                    onChange={e => setNewAppliance({...newAppliance, testExecution: e.target.value})}/>
                    <input placeholder='UserStory link'
                    onChange={e => setNewAppliance({...newAppliance, userStory: e.target.value})}/>
                    <button type='submit'>Save</button>
                    <button type='button'onClick={()=> setCreating(false)}>Cancel</button>
                </form>
            )}
        </div>
    );
}

export default App;
