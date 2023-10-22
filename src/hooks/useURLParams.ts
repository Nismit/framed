export const useURLParams = (key: string) => {
  const currentURL = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentURL.search);
  const result = searchParams.get(key);
  return result ?? undefined;
};
