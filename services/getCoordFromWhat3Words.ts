import axios from 'axios';

export const getCoordFromWhat3Words = async (searchTerm) => {
  const wordParts = searchTerm.split('.');
  console.log(wordParts);
  if (wordParts.length !== 3)
    return {
      isError: true,
      error: {
        message:
          'There are not 3 words entered into the box. Please format the words by separating with a dot between each (e.g. first.second.third)',
      },
    };
  const apiKey = process.env.WHAT_3_WORDS_API_KEY;
  const w3wUrl = `https://api.what3words.com/v3/convert-to-coordinates?words=${searchTerm}&key=${apiKey}`;
  const response = (await axios.get(w3wUrl)).data;
  if (response?.error) {
    return { isError: true, error: response.error };
  } else {
    const { country, coordinates } = response;
    const { lat, lng } = coordinates;
    return { isError: false, country, coordinates: { Latitude: lat, Longitude: lng } };
  }
};
