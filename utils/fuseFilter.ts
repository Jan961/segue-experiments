import Fuse from 'fuse.js';

export const fuseFilter: any = (options: any, searchTerm: string, keys: string[], fuseParams = null) => {
  const fuseOptions = fuseParams || {
    includeScore: true,
    includeMatches: true,
    isCaseSensitive: false,
    shouldSort: true,
    useExtendedSearch: true,
    threshold: 0.3,
    keys,
  };

  const filterObject = new Fuse(options, fuseOptions);
  return filterObject.search(searchTerm).map((item) => item.item);
};
export default fuseFilter;
