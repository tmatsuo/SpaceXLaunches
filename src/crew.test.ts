import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import fetchMock from 'jest-fetch-mock'

import {getCrewName, fetchCrewNames} from "./crew"

describe('getCrewName', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  it('calls fetchCrewNames', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(
      [{"id": "abcd", "name":"John Doh"}]));
    const crewName = await getCrewName("abcd");
    expect(crewName).toBe("John Doh");
    const notFound = await getCrewName("xxxx");
    // it just returns the id
    expect(notFound).toBe("xxxx");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("https://api.spacexdata.com/v4/crew");
  });
});
