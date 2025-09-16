// api.ts contains functions to call Go backend.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

export type Appliance = {
    updatedAt: string;
    features: string[];
    bugs: string[];
    model: string;
    serial: string;
    fwVersion: string;
    userStory: string;
    testExe: string;
    id: string;
    inLabCount: number;
    ready: boolean;
};

export async function getAppliances(): Promise<Appliance[]> {
    const res = await fetch(`${API_URL}/appliances`);
    if (!res.ok) throw new Error("Failed to fetch appliances");
    return res.json();
}

export async function createAppliance(appliance: Partial<Appliance>): Promise<Appliance> {
    const res = await fetch(`${API_URL}/appliances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appliance),
    });

    if (!res.ok) throw new Error("Failed to create appliance");
    return res.json();
}
