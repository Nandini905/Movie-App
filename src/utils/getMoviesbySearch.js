// Case-insensitive filter on title and overview. Safe against missing fields.
export function filterMoviesByQuery(movies, query) {
  const list = Array.isArray(movies) ? movies : [];
  const q = (query || '').trim().toLowerCase();
  if (!q) return list;

  return list.filter((m) => {
    const title = (m?.title || '').toLowerCase();
    const overview = (m?.overview || '').toLowerCase();
    const director = (m?.director || '').toLowerCase();
    // Support multiple shapes for actors/writers: array of strings or single string
    const actorsArr = Array.isArray(m?.actors) ? m.actors : (m?.cast && Array.isArray(m.cast) ? m.cast : []);
    const writersArr = Array.isArray(m?.writers) ? m.writers : (Array.isArray(m?.writer) ? m.writer : []);
    const actors = actorsArr.map(a => (a || '').toString().toLowerCase()).join(' ');
    const writers = writersArr.map(w => (w || '').toString().toLowerCase()).join(' ');

    return (
      title.includes(q) ||
      overview.includes(q) ||
      director.includes(q) ||
      actors.includes(q) ||
      writers.includes(q)
    );
  });
}

export default filterMoviesByQuery;

