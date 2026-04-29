import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'https://graphql.anilist.co'

const cache = new Map()
const CACHE_TTL = 10 * 60 * 1000

const graphqlRequest = async (query, variables = {}, cacheKey = null) => {
  if (cacheKey) {
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }
  }

  try {
    const response = await axios.post(API_URL, { query, variables }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 15000
    })

    const result = response.data?.data

    if (cacheKey && result) {
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      })
    }

    return result
  } catch (error) {
    if (cacheKey && cache.has(cacheKey)) {
      return cache.get(cacheKey).data
    }
    throw error
  }
}

const QUERIES = {
  POPULAR: `
    query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(type: ANIME, sort: $sort, status_not: NOT_YET_RELEASED) {
          id
          idMal
          title { romaji, english, native, userPreferred }
          description(asHtml: false)
          coverImage { large, medium, extraLarge }
          bannerImage
          format
          status
          episodes
          duration
          seasonYear
          averageScore
          popularity
          genres
          tags { name, rank }
          studios(isMain: true) { nodes { name } }
        }
      }
    }
  `,
  ONGOING: `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
          id
          idMal
          title { romaji, english, native, userPreferred }
          description(asHtml: false)
          coverImage { large, medium, extraLarge }
          bannerImage
          format
          status
          episodes
          duration
          seasonYear
          averageScore
          popularity
          genres
          nextAiringEpisode { episode, timeUntilAiring }
        }
      }
    }
  `,
  BY_ID: `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        idMal
        title { romaji, english, native, userPreferred }
        description(asHtml: false)
        coverImage { large, medium, extraLarge }
        bannerImage
        format
        status
        episodes
        duration
        seasonYear
        averageScore
        popularity
        genres
        tags { name, rank }
        studios(isMain: true) { nodes { name } }
        relations { edges { node { id, title { userPreferred }, format, coverImage { medium } } relationType } }
        trailer { id, site, thumbnail }
        externalLinks { url, site, icon }
        streamingEpisodes { title, thumbnail, url, site }
      }
    }
  `,
  SEARCH: `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(type: ANIME, search: $search, sort: POPULARITY_DESC) {
          id
          idMal
          title { romaji, english, native, userPreferred }
          description(asHtml: false)
          coverImage { large, medium }
          format
          status
          episodes
          seasonYear
          averageScore
          genres
        }
      }
    }
  `,
  RANDOM: `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, status: FINISHED, sort: POPULARITY_DESC) {
          id
          idMal
          title { romaji, english, native, userPreferred }
          description(asHtml: false)
          coverImage { large, medium }
          format
          episodes
          seasonYear
          averageScore
          genres
          status
        }
      }
    }
  `,
  GENRES: `
    query {
      GenreCollection
    }
  `,
  BY_GENRE: `
    query ($genre: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(type: ANIME, genre: $genre, sort: POPULARITY_DESC) {
          id
          idMal
          title { romaji, english, native, userPreferred }
          coverImage { large, medium, extraLarge }
          bannerImage
          format
          episodes
          seasonYear
          averageScore
          genres
        }
      }
    }
  `,
  BY_TYPE: `
    query ($format: MediaFormat, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(type: ANIME, format: $format, sort: POPULARITY_DESC) {
          id
          idMal
          title { romaji, english, native, userPreferred }
          description(asHtml: false)
          coverImage { large, medium, extraLarge }
          bannerImage
          format
          status
          episodes
          duration
          seasonYear
          averageScore
          popularity
          genres
          tags { name, rank }
          studios(isMain: true) { nodes { name } }
        }
      }
    }
  `
}

const adaptMedia = (media) => ({
  id: media.id,
  mal_id: media.idMal,
  name: media.title?.english || media.title?.romaji || media.title?.native || 'Без названия',
  russian: media.title?.native,
  title: media.title,
  description: media.description || 'Описание отсутствует',
  image: {
    original: media.coverImage?.extraLarge || media.coverImage?.large || media.coverImage?.medium,
    medium: media.coverImage?.medium,
    large: media.coverImage?.large,
    extraLarge: media.coverImage?.extraLarge
  },
  poster: media.coverImage,
  banner: media.bannerImage,
  score: media.averageScore ? media.averageScore / 10 : null,
  popularity: media.popularity,
  episodes: media.episodes,
  episodes_total: media.episodes,
  duration: media.duration,
  year: media.seasonYear,
  kind: mapFormat(media.format),
  status: mapStatus(media.status),
  genres: media.genres || [],
  tags: media.tags?.map(t => t.name) || [],
  studios: media.studios?.nodes || [],
  trailer: media.trailer,
  externalLinks: media.externalLinks,
  streamingEpisodes: media.streamingEpisodes,
  relations: media.relations?.edges?.map(edge => ({
    node: edge.node,
    relationType: edge.relationType
  })) || []
})

const mapFormat = (format) => {
  const map = {
    TV: 'tv',
    TV_SHORT: 'tv',
    MOVIE: 'movie',
    OVA: 'ova',
    ONA: 'ona',
    SPECIAL: 'special',
    MUSIC: 'music'
  }
  return map[format] || format?.toLowerCase() || 'unknown'
}

const mapStatus = (status) => {
  const map = {
    RELEASING: 'ongoing',
    FINISHED: 'completed',
    NOT_YET_RELEASED: 'announced',
    CANCELLED: 'cancelled',
    HIATUS: 'hiatus'
  }
  return map[status] || status?.toLowerCase() || 'unknown'
}

export const useAnimeStore = defineStore('anime', () => {
  const ongoings = ref([])
  const popular = ref([])
  const popularMovies = ref([])
  const popularSeries = ref([])
  const popularOVA = ref([])
  const popularONA = ref([])
  const popularSpecial = ref([])
  const genres = ref([])
  const currentAnime = ref(null)
  const loading = ref(false)
  const initialLoading = ref(true)
  const error = ref(null)

  const fetchOngoings = async () => {
    try {
      const result = await graphqlRequest(
        QUERIES.ONGOING,
        { page: 1, perPage: 8 },
        'ongoings'
      )
      ongoings.value = result?.Page?.media?.map(adaptMedia) || []
    } catch (err) {
      ongoings.value = []
    }
  }

  const fetchPopular = async () => {
    try {
      const result = await graphqlRequest(
        QUERIES.POPULAR,
        { page: 1, perPage: 12, sort: ['POPULARITY_DESC'] },
        'popular'
      )
      popular.value = result?.Page?.media?.map(adaptMedia) || []
    } catch (err) {
      popular.value = []
    }
  }

  const fetchPopularMovies = async () => {
    try {
      const result = await graphqlRequest(
        QUERIES.POPULAR,
        { page: 1, perPage: 50, sort: ['POPULARITY_DESC'] },
        'movies'
      )
      popularMovies.value = result?.Page?.media
        ?.filter(m => m.format === 'MOVIE')
        ?.map(adaptMedia) || []
    } catch (err) {
      popularMovies.value = []
    }
  }

  const fetchPopularSeries = async () => {
    try {
      const result = await graphqlRequest(
        QUERIES.POPULAR,
        { page: 1, perPage: 50, sort: ['POPULARITY_DESC'] },
        'series'
      )
      popularSeries.value = result?.Page?.media
        ?.filter(m => m.format === 'TV' || m.format === 'TV_SHORT')
        ?.map(adaptMedia) || []
    } catch (err) {
      popularSeries.value = []
    }
  }

  const fetchPopularOVA = async () => {
    try {
      const result = await graphqlRequest(
        QUERIES.BY_TYPE,
        { format: 'OVA', page: 1, perPage: 50 },
        'ova'
      )
      popularOVA.value = result?.Page?.media?.map(adaptMedia) || []
    } catch (err) {
      popularOVA.value = []
    }
  }

  const fetchPopularONA = async () => {
    try {
      const result = await graphqlRequest(
        QUERIES.BY_TYPE,
        { format: 'ONA', page: 1, perPage: 50 },
        'ona'
      )
      popularONA.value = result?.Page?.media?.map(adaptMedia) || []
    } catch (err) {
      popularONA.value = []
    }
  }

  const fetchPopularSpecial = async () => {
    try {
      const result = await graphqlRequest(
        QUERIES.BY_TYPE,
        { format: 'SPECIAL', page: 1, perPage: 50 },
        'special'
      )
      popularSpecial.value = result?.Page?.media?.map(adaptMedia) || []
    } catch (err) {
      popularSpecial.value = []
    }
  }

  const fetchGenres = async () => {
    try {
      const result = await graphqlRequest(QUERIES.GENRES, {}, 'genres')
      const allGenres = result?.GenreCollection || []
      
      const filteredGenres = allGenres
        .filter(name => name.toLowerCase() !== 'hentai')
        .map((name) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name: name,
          anime_count: 0,
          backgroundImage: null
        }))

      for (let i = 0; i < Math.min(filteredGenres.length, 10); i++) {
        const genre = filteredGenres[i]
        try {
          const genreAnime = await graphqlRequest(
            QUERIES.BY_GENRE,
            { genre: genre.name, page: 1, perPage: 1 },
            `genre-bg-${genre.id}`
          )
          
          const firstAnime = genreAnime?.Page?.media?.[0]
          if (firstAnime) {
            genre.backgroundImage = firstAnime.bannerImage || firstAnime.coverImage?.large
          }
        } catch (err) {
          console.warn(`Could not load background for ${genre.name}`)
        }
        
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      genres.value = filteredGenres
    } catch (err) {
      genres.value = []
    }
  }

  const initialize = async () => {
    initialLoading.value = true
    error.value = null
    try {
      await Promise.allSettled([
        fetchPopular(),
        fetchPopularMovies(),
        fetchPopularSeries(),
        fetchPopularOVA(),
        fetchPopularONA(),
        fetchPopularSpecial(),
        fetchGenres()
      ])
      await fetchOngoings()
    } catch (err) {
      error.value = err.message
    } finally {
      initialLoading.value = false
    }
  }

  const fetchAnimeById = async (id) => {
    loading.value = true
    try {
      const result = await graphqlRequest(
        QUERIES.BY_ID,
        { id: parseInt(id) },
        `anime-${id}`
      )
      currentAnime.value = result?.Media ? adaptMedia(result.Media) : null
      return currentAnime.value
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchAnime = async (query) => {
    if (!query || query.length < 2) return []
    try {
      const result = await graphqlRequest(
        QUERIES.SEARCH,
        { search: query, page: 1, perPage: 15 },
        `search-${query}`
      )
      return result?.Page?.media?.map(adaptMedia) || []
    } catch (err) {
      return []
    }
  }

  const getAnimeByGenre = async (genreName) => {
    try {
      const result = await graphqlRequest(
        QUERIES.BY_GENRE,
        { genre: genreName, page: 1, perPage: 20 },
        `genre-${genreName}`
      )
      return result?.Page?.media?.map(adaptMedia) || []
    } catch (err) {
      return []
    }
  }

  const getAnimeByGenreWithPage = async (genreName, page = 1) => {
    try {
      const result = await graphqlRequest(
        QUERIES.BY_GENRE,
        { genre: genreName, page: page, perPage: 50 },
        `genre-${genreName}-page-${page}`
      )
      return result?.Page?.media?.map(adaptMedia) || []
    } catch (err) {
      return []
    }
  }

  const getRandomAnime = async () => {
    try {
      const randomPage = Math.floor(Math.random() * 100) + 1
      const result = await graphqlRequest(
        QUERIES.RANDOM,
        { page: randomPage, perPage: 10 },
        `random-page-${randomPage}`
      )
      
      const media = result?.Page?.media || []
      
      if (media.length > 0) {
        const randomIndex = Math.floor(Math.random() * media.length)
        return adaptMedia(media[randomIndex])
      }
      
      return null
    } catch (err) {
      return null
    }
  }

  const getAnimeByTypeWithPage = async (format, page = 1) => {
    try {
      const result = await graphqlRequest(
        QUERIES.POPULAR,
        { page: page, perPage: 50, sort: ['POPULARITY_DESC'] },
        `type-${format}-page-${page}`
      )
      
      const pageInfo = result?.Page?.pageInfo
      
      const filtered = result?.Page?.media
        ?.filter(m => m.format?.toUpperCase() === format.toUpperCase())
        ?.map(adaptMedia) || []
      
      return {
        anime: filtered,
        hasNextPage: pageInfo?.hasNextPage || false,
        total: pageInfo?.total || 0
      }
    } catch (err) {
      return {
        anime: [],
        hasNextPage: false,
        total: 0
      }
    }
  }

  const getPopularWithPage = async (page = 1) => {
    try {
      const result = await graphqlRequest(
        QUERIES.POPULAR,
        { page: page, perPage: 50, sort: ['POPULARITY_DESC'] },
        `popular-page-${page}`
      )
      
      const pageInfo = result?.Page?.pageInfo
      const results = result?.Page?.media?.map(adaptMedia) || []
    
      return {
        anime: results,
        hasNextPage: pageInfo?.hasNextPage || false,
        total: pageInfo?.total || 0
      }
    } catch (err) {
      return {
        anime: [],
        hasNextPage: false,
        total: 0
      }
    }
  }

  return {
    ongoings,
    popular,
    popularMovies,
    popularSeries,
    popularOVA,
    popularONA,
    popularSpecial,
    genres,
    currentAnime,
    loading,
    initialLoading,
    error,
    fetchOngoings,
    fetchPopular,
    fetchPopularMovies,
    fetchPopularSeries,
    fetchPopularOVA,
    fetchPopularONA,
    fetchPopularSpecial,
    fetchGenres,
    initialize,
    fetchAnimeById,
    searchAnime,
    getAnimeByGenre,
    getAnimeByGenreWithPage,
    getRandomAnime,
    getAnimeByTypeWithPage,
    getPopularWithPage
  }
})