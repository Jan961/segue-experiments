import axios from 'axios';

export const getCoordFromWhat3Words = async (searchTerm) => {
  const wordParts = searchTerm.split('.');
  if (wordParts.length !== 3)
    return {
      isError: true,
      error: {
        message:
          'There are not 3 words entered into the box. Please format the words by separating with a dot between each (e.g. first.second.third)',
      },
    };
  const apiKey = process.env.WHAT_3_WORDS_API_KEY;
  const w3wUrl = `${process.env.WHAT_3_WORDS_TO_COORD_BASE_URL}${searchTerm}&key=${apiKey}`;
  const response = await axios.get(w3wUrl);
  const result = response?.data;
  if (result?.error) {
    return { isError: true, error: result.error };
  } else {
    const { coordinates } = result;
    const { lat, lng } = coordinates;
    return { isError: false, coordinates: { Latitude: lat, Longitude: lng } };
  }
};
