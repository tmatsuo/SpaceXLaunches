/**
 * Helper functions for the crew api.
 *
 * https://github.com/r-spacex/SpaceX-API/blob/master/docs/crew/v4/all.md
 *
 * We only use crew names in the app. In assumption that the crew
 * names don't change frequently, we cache the mapping for 1 day.
 */

const CREW_CACHE_EXPIRATION = 86400; // 1 day

let crewNameMapping: Map<string, string> = new Map<string, string>();
let lastFetched = Date.now() - CREW_CACHE_EXPIRATION;


export async function getCrewName(crew_id: string): string {
    const now = Date.now();
    if (now > lastFetched + CREW_CACHE_EXPIRATION) {
        await fetchCrewNames();
    }
    if (!crewNameMapping.has(crew_id)) {
        return crew_id;
    }
    return crewNameMapping.get(crew_id) as string;
}

/**
 * Fetches crew names from the API and update the cache.
 *
 * TODO: research if we need to lock and guard the map.
 */
async function fetchCrewNames() {
    const response = await fetch(
	"https://api.spacexdata.com/v4/crew");
    const data = await response.json();
    for (const crew of data) {
        crewNameMapping.set(crew.id, crew.name);
    }
}
