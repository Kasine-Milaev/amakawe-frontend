export const GENRE_TRANSLATIONS = {
  'Action': 'Боевик',
  'Adventure': 'Приключения',
  'Comedy': 'Комедия',
  'Drama': 'Драма',
  'Ecchi': 'Этти',
  'Fantasy': 'Фэнтези',
  'Horror': 'Ужасы',
  'Mahou Shoujo': 'Волшебница',
  'Mecha': 'Меха',
  'Music': 'Музыка',
  'Mystery': 'Мистика',
  'Psychological': 'Психологическое',
  'Romance': 'Романтика',
  'Sci-Fi': 'Фантастика',
  'Slice of Life': 'Повседневность',
  'Sports': 'Спорт',
  'Supernatural': 'Сверхъестественное',
  'Thriller': 'Триллер'
}

// Функция перевода жанров
export function translateGenres(genres) {
  return genres.map(genre => GENRE_TRANSLATIONS[genre] || genre)
}