const API_URL = 'https://graphql.anilist.co'
export async function fetchPopularAnime(page = 1, perPage = 10) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
            userPreferred
          }
          coverImage {
            large
            extraLarge
          }
          genres
          status
          episodes
          averageScore
          season
          seasonYear
          description(asHtml: false)
        }
      }
    }
  `

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { page, perPage } })
  })

  const result = await response.json()
  return result.data.Page.media
}
export async function searchAnime(searchTerm, page = 1, perPage = 10) {
  const query = `
    query ($page: Int, $perPage: Int, $search: String) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, search: $search) {
          id
          title {
            romaji
            english
            native
            userPreferred
          }
          coverImage {
            large
            extraLarge
          }
          genres
          status
          episodes
          averageScore
          season
          seasonYear
          description(asHtml: false)
          studios {
            nodes {
              name
            }
          }
        }
      }
    }
  `

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { page, perPage, search: searchTerm } })
  })

  const result = await response.json()
  return result.data.Page.media
}
export async function getAnimeById(id) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
        coverImage {
          large
          extraLarge
        }
        genres
        status
        episodes
        averageScore
        season
        seasonYear
        description(asHtml: false)
        studios {
          nodes {
            name
          }
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        duration
        popularity
        favourites
      }
    }
  `

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { id } })
  })

  const result = await response.json()
  return result.data.Media
}
export async function fetchCurrentSeasonAnime(page = 1, perPage = 6) {
  const query = `
    query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: ANIME
          status: RELEASING
          season: $season
          seasonYear: $seasonYear
          sort: POPULARITY_DESC
        ) {
          id
          title {
            romaji
            english
            native
            userPreferred
          }
          coverImage {
            extraLarge
            large
          }
          genres
          averageScore
          episodes
          startDate {
            year
            month
            day
          }
        }
      }
    }
  `

  const now = new Date()
  const year = now.getFullYear()
  let season = 'WINTER'
  const month = now.getMonth() + 1

  if (month >= 1 && month <= 3) season = 'WINTER'
  else if (month >= 4 && month <= 6) season = 'SPRING'
  else if (month >= 7 && month <= 9) season = 'SUMMER'
  else if (month >= 10 && month <= 12) season = 'FALL'

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { page, perPage, season, seasonYear: year }
    })
  })

  const result = await response.json()
  return result.data.Page.media
}