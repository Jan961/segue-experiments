export const formatUrl = (inputUrl: string): string => {
    if (inputUrl.startsWith('https://')) {
        return inputUrl;
    }
    return `https://${inputUrl}`
}