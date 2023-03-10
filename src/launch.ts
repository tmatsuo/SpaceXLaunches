import {getCrewName} from './crew';
import {getRocketName} from './rocket';

/**
 * Interface and helper functions for data retrieved from:
 * https://github.com/r-spacex/SpaceX-API
 */


/**
 * Represents a launch.
 */
export interface Launch {
  id: string, 
  rocketId: string, // Rocket id
  rocketName: string,
  flightNumber: number,
  launchDate: string,
  crew: string[],
  details: string, // Mission details
  rocketStatus: string
}

interface Fairings {
  reused?: boolean,
  recovery_attempt?: boolean,
  recovered?: boolean,
}

function determineRocketStatus(fairings: Fairings|null): string {
  if (fairings?.reused === true) {
    return "Reused";
  } else if (fairings?.recovery_attempt === true) {
    return "Recovery attempt";
  } else if (fairings?.recovered === true) {
    return "Recovered";
  } else {
    return "Other";
  }
}

/**
 * Gets all the launches.
 */
export async function getLaunches(): Promise<Launch[]> {
  const response = await fetch(
	  "https://api.spacexdata.com/v5/launches/upcoming");
  const data = await response.json();

  let ret: Launch[] = [];
  for (const launch of data) {
    let crew: string[] = [];
    for (const member of launch.crew) {
      const name = await getCrewName(member.crew);
      crew.push(name + `(${member.role})`);
    }
	  ret.push(
	    {id: launch.id,
       rocketName: await getRocketName(launch.rocket),
       rocketId: launch.rocket,
	     flightNumber: launch.flight_number,
	     launchDate: launch.date_utc,
       crew: crew,
	     details: launch.details,
       rocketStatus: determineRocketStatus(launch.fairings),
	    }
	  );
  };
  return ret;
}
