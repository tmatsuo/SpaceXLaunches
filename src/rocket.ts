/**
 * Helper functions for the rockets api.
 *
 * https://github.com/r-spacex/SpaceX-API/blob/master/docs/rockets/v4/all.md
 *
 * We only use rocket name in the app. In assumption that the rocket
 * names don't change frequently, we cache the mapping for 1 day.
 */

const ROCKETS_CACHE_EXPIRATION = 86400; // 1 day

let rocketNameMapping: Map<string, string> = new Map<string, string>();
let lastFetched = Date.now() - ROCKETS_CACHE_EXPIRATION;


export async function getRocketName(rocket_id: string): Promise<string> {
    const now = Date.now();
    if (now > lastFetched + ROCKETS_CACHE_EXPIRATION) {
        await fetchRocketNames();
    }
    if (!rocketNameMapping.has(rocket_id)) {
        return rocket_id;
    }
    return rocketNameMapping.get(rocket_id) as string;
}

/**
 * Fetches rocket names from the API and update the cache.
 */
export async function fetchRocketNames() {
  const response = await fetch(
	  "https://api.spacexdata.com/v4/rockets");
  const data = await response.json();
  lastFetched = Date.now();
  for (const rocket of data) {
    rocketNameMapping.set(rocket.id, rocket.name);
  }
}
