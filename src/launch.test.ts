import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import fetchMock from 'jest-fetch-mock'

import * as crewModule from "./crew"
import * as rocketModule from "./rocket"

import {Launch, getLaunches} from "./launch"

describe('getLaunches', () => {
  const getCrewNameMock = jest.spyOn(crewModule, "getCrewName");
  const getRocketNameMock = jest.spyOn(rocketModule, "getRocketName");
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should retrieve launches via the API', async () => {
    getCrewNameMock.mockResolvedValue("Crew Name");
    getRocketNameMock.mockResolvedValue("Rocket Name");
    fetchMock.mockResponseOnce(JSON.stringify(
      [{
        "rocket": "rocket_id",
        "flight_number": 1,
        "date_utc": "2022-11-01T13:41:00.000Z",
        "crew": [{"id": "crew_id", "role": "Commander"}],
        "details": "Mission details",
        "fairings": {"reused": true},
        "id": "abcd",
      }
      ]));
    const launches = await getLaunches();
    expect(launches.length).toBe(1);
    expect(launches[0].id).toBe("abcd");
    expect(launches[0].rocketName).toBe("Rocket Name");
    expect(launches[0].rocketId).toBe("rocket_id");
    expect(launches[0].flightNumber).toBe(1);
    expect(launches[0].launchDate).toBe("2022-11-01T13:41:00.000Z");
    expect(launches[0].crew).toStrictEqual(["Crew Name(Commander)"]);
    expect(launches[0].details).toBe("Mission details");
    expect(launches[0].rocketStatus).toBe("Reused");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.spacexdata.com/v5/launches/upcoming");
  });
});
