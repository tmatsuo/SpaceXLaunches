import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import fetchMock from 'jest-fetch-mock'

import {getRocketName, fetchRocketNames} from "./rocket"

describe('getRocketName', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  it('calls fetchRocketNames', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(
      [{"id": "abcd", "name":"Falcon9"}]));
    const rocketName = await getRocketName("abcd");
    expect(rocketName).toBe("Falcon9");
    const notFound = await getRocketName("xxxx");
    // it just returns the id
    expect(notFound).toBe("xxxx");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("https://api.spacexdata.com/v4/rockets");
  });
});
