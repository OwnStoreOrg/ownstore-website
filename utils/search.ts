export const getSearchPageUrl = () => {
  return '/search'
}

export const getSearchResultPageUrl = (searchTerm: string) => {
  return `/search/result/${searchTerm}`
}
