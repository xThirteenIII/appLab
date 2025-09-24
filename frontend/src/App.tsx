import { useEffect, useState } from 'react'
import { Link } from '@chakra-ui/react'
import { createAppliance, getAppliances, deleteAppliance, type Appliance, updateAppliance} from './api';
import './App.css'
import { LuExternalLink } from 'react-icons/lu';

function App() {
    // Returns a stateful value, and a function to update it.
    const [appliances, setAppliances] = useState<Appliance[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // NewAppliance state for creating new appliances in DB
    const [newAppliance, setNewAppliance] = useState<Partial<Appliance>>({});
    const [creating, setCreating] = useState(false);

    // Editing state for appliance update
    const [editingAppliance, setEditingAppliance] = useState<Partial<Appliance> | null>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        getAppliances()
            .then(data => {
                // Best practice: check array is an array
                setAppliances(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);
    
    if (loading) return <p>Loading appliances...</p>;
    if (error) return <p style={{color:"red"}}>Error: {error}</p>

    // Open editing form and populate it with current data from appliance in DB
    const startEditing = (a: Appliance) => {
        setEditingAppliance(a);
        setEditing(true);
    }

    // Save form changes and update appliances list
    const handleUpdatedSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAppliance || !editingAppliance.id) return;

        try {
            const updated = await updateAppliance(editingAppliance.id, editingAppliance);

            // Update list with the new updated appliance
            setAppliances(appliances.map(ap => ap.id === updated.id ? updated : ap));
            setEditing(false);
            setEditingAppliance(null);
        } catch (e) {
            setError((e as Error).message);
        }
    }
    
    return (
        <div style={{padding: "1rem"}}>
            <h1>Appliances</h1>
            {Array.isArray(appliances) && appliances.length === 0 ? (
                <p>no appliances found</p>
            ) : (
                <ul>
                    {Array.isArray(appliances) && appliances.map(a => (
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
                            <button style = {{ marginLeft: "1rem"}} onClick={ () => startEditing(a)}>Update</button>
                            {editing && editingAppliance?.id === a.id && (
                                <form
                                    onSubmit={ handleUpdatedSubmit }
                                    style={{marginBottom: "1rem"}}
                                >
                                    <input 
                                        value={editingAppliance.model || ""}
                                        onChange={e => setEditingAppliance({...editingAppliance, model: e.target.value})}
                                    />
                                    <input 
                                        value={editingAppliance.macAddress || ""}
                                        onChange={e => setEditingAppliance({...editingAppliance, macAddress: e.target.value})}
                                    />
                                    <input 
                                        value={editingAppliance.serial || ""}
                                        onChange={e => setEditingAppliance({...editingAppliance, serial: e.target.value})}
                                    />
                                    <input 
                                        value={editingAppliance.fwVersion || ""}
                                        onChange={e => setEditingAppliance({...editingAppliance, fwVersion: e.target.value})}
                                    />
                                    <input 
                                        value={editingAppliance.testExecution || ""}
                                        onChange={e => setEditingAppliance({...editingAppliance, testExecution: e.target.value})}
                                    />
                                    <input 
                                        value={editingAppliance.userStory || ""}
                                        onChange={e => setEditingAppliance({...editingAppliance, userStory: e.target.value})}
                                    />
                                    <button type='submit'>Save</button>
                                    <button type='button'onClick={()=> {
                                        setEditing(false);
                                        setEditingAppliance(null);
                                        }}
                                    >Cancel</button>
                                </form>
                            )}
                        </li>
                    ))}
                </ul>
            )}
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
            <button style={{margin: "1rem"} } onClick={()=> setCreating(true)}>+ Add appliance</button>
        </div>
    );
}

export default App;
