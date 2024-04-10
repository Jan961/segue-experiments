import { formatUrl } from 'utils/formatUrl'; // Update with the actual path

describe('formatUrl', () => {
  it('should return an empty string if input is null or empty', () => {
    expect(formatUrl('')).toBe('');
    expect(formatUrl(null)).toBe('');
  });

  it('should return the original URL if it already starts with https://', () => {
    const validHttpsUrl = 'https://example.com';
    expect(formatUrl(validHttpsUrl)).toBe(validHttpsUrl);
  });

  it('should add https:// to the beginning of a URL that does not have it', () => {
    const httpUrl = 'example.com';
    const expectedUrl = 'https://example.com';
    expect(formatUrl(httpUrl)).toBe(expectedUrl);
  });
});
