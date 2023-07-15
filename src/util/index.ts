export async function fetchMovies<T>({
  token,
  year,
}: {
  token: string;
  year: string;
}): Promise<T> {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?${year && `year= ${year}`}`,
      options,
    );

    return res.json();
  } catch (error) {
    return error;
  }
}
