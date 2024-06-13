import fuseFilter from '../fuseFilter';

const options = [
  { title: "Old Man's War", author: 'John Scalzi' },
  { title: 'The Lock Artist', author: 'Steve Hamilton' },
  { title: 'HTML5', author: 'Remy Sharp' },
  { title: 'Right Ho Jeeves', author: 'P.D. Woodhouse' },
  { title: 'The Code of the Wooster', author: 'P.D. Woodhouse' },
  { title: 'Thank You Jeeves', author: 'P.D. Woodhouse' },
  { title: 'The DaVinci Code', author: 'Dan Brown' },
  { title: 'Angels & Demons', author: 'Dan Brown' },
  { title: 'The Silmarillion', author: 'J.R.R. Tolkien' },
  { title: 'Syrup', author: 'Maxx Barry' },
  { title: 'The Lost Symbol', author: 'Dan Brown' },
  { title: 'The Book of Lies', author: 'Brad Meltzer' },
  { title: 'Lamb', author: 'Christopher Moore' },
  { title: 'Fool', author: 'Christopher Moore' },
  { title: 'Incompetence', author: 'Rob Grant' },
  { title: 'Fat', author: 'Rob Grant' },
  { title: 'Colony', author: 'Rob Grant' },
  { title: 'Backwards, Red Dwarf', author: 'Rob Grant' },
  { title: 'The Grand Design', author: 'Stephen Hawking' },
  { title: 'The Book of Samson', author: 'David Maine' },
  { title: 'The Preservationist', author: 'David Maine' },
  { title: 'Fallen', author: 'David Maine' },
  { title: 'Monster 1959', author: 'David Maine' },
];

describe('fuseFilter', () => {
  it('Should find the results depending on the search term and options array. Search term should also be case-insensitive', () => {
    const searchTerm = 'moore chris';
    const keys = ['author', 'title'];
    const result = fuseFilter(options, searchTerm, keys);

    expect(result).toEqual([
      { title: 'Lamb', author: 'Christopher Moore' },
      { title: 'Fool', author: 'Christopher Moore' },
    ]);
  });

  it('Should return empty if there are no valid results found', () => {
    const searchTerm = 'some value where there will be no results like this one for example';
    const keys = ['author', 'title'];
    const result = fuseFilter(options, searchTerm, keys);

    expect(result).toEqual([]);
  });

  it('Should use custom parameters if they are provided', () => {
    const customFuseParams = {
      includeScore: true,
      includeMatches: true,
      isCaseSensitive: true,
      useExtendedSearch: true,
      threshold: 0.3,
      keys: [],
    };

    const searchTerm = 'John';
    const keys = ['author'];
    const result = fuseFilter(options, searchTerm, keys, customFuseParams);

    expect(result).toEqual([{ title: "Old Man's War", author: 'John Scalzi' }]);
  });

  it('Should return all values if there is no search term', () => {
    const searchTerm = '';
    const keys = ['author', 'title'];
    const result = fuseFilter(options, searchTerm, keys);

    expect(result).toEqual(options);
  });
});
