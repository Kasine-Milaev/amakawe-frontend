import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AnimeDetailsView from '../views/AnimeDetailsView.vue'
import CollectionsView from '../views/CollectionsView.vue'
import RandomView from '../views/RandomView.vue'
import SearchResultsView from '../views/SearchResultsView.vue'
import GenreFilterView from '../views/GenreFilterView.vue'
import PopularView from '../views/PopularView.vue'
import AllGenresView from '../views/AllGenresView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/anime/:id',
    name: 'anime-details',
    component: AnimeDetailsView
  },
  {
    path: '/collections',
    name: 'collections',
    component: CollectionsView
  },
  {
    path: '/random',
    name: 'random',
    component: RandomView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchResultsView
  },
  {
    path: '/popular',
    name: 'popular',
    component: PopularView
  },
  {
    path: '/genres',
    name: 'all-genres',
    component: AllGenresView
  },
  {
    path: '/genre/:genre',
    name: 'genre',
    component: GenreFilterView
  },
  {
    path: '/type/:type',
    name: 'type',
    component: GenreFilterView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router