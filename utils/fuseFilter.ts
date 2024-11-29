import Fuse from 'fuse.js';

export const fuseFilter: any = (options: any, searchTerm: string, keys: string[], fuseCustomParams = null) => {
  if (!searchTerm) return options;

  if (fuseCustomParams) fuseCustomParams.keys = keys;
  const fuseParams = fuseCustomParams || {
    includeScore: true,
    // includeMatches: true,
    isCaseSensitive: false,
    shouldSort: true,
    useExtendedSearch: true,
    threshold: 0.5,
    ignoreLocation: true,
    keys,
  };

  const filterObject = new Fuse(options, fuseParams);
  return filterObject.search(searchTerm).map((item) => item.item);
};
export default fuseFilter;
