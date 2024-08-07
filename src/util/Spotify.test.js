import Spotify from './Spotify';

describe('Spotify.makeRecommendation', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    Spotify.getAccessToken = jest.fn().mockReturnValue('mock-access-token');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch recommendations and return formatted track data', async () => {
    const mockResponse = {
      tracks: [
        {
          id: '1',
          name: 'Test Track',
          artists: [{ name: 'Test Artist' }],
          album: { name: 'Test Album' },
          uri: 'spotify:track:1',
          preview_url: 'https://example.com/preview.mp3',
        },
        {
          id: '2',
          name: 'Another Track',
          artists: [{ name: 'Another Artist' }],
          album: { name: 'Another Album' },
          uri: 'spotify:track:2',
          preview_url: null,
        },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await Spotify.makeRecommendation('1', '2');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/recommendations?limit=25&market=US&seed_tracks=1,2',
      {
        headers: {
          Authorization: 'Bearer mock-access-token',
        },
      }
    );

    expect(result).toEqual([
      {
        id: '1',
        name: 'Test Track',
        artist: 'Test Artist',
        album: 'Test Album',
        uri: 'spotify:track:1',
        preview_url: 'https://example.com/preview.mp3',
        spotifyLogo: 'spotify-logo.png',
        spotifyLink: 'https://open.spotify.com/track/1',
      },
      {
        id: '2',
        name: 'Another Track',
        artist: 'Another Artist',
        album: 'Another Album',
        uri: 'spotify:track:2',
        preview_url: 'No preview available',
        spotifyLogo: 'spotify-logo.png',
        spotifyLink: 'https://open.spotify.com/track/2',
      },
    ]);
  });

  it('should return an empty array if no tracks are found', async () => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ tracks: null }),
    });

    const result = await Spotify.makeRecommendation('1', '2', '3', '4', '5');

    expect(result).toEqual([]);
  });
});