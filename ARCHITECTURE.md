# Архитектурный план проекта Amakawe

## Frontend-архитектура

[Telegram Client] 🔛 [Mini App] 🔛 [External Anime APIs]

## Компонентная структура (React)

- `App.jsx` - корневой компонент, инициализация Telegram Web App
- `Catalog/` - компонент каталога с сеткой тайтлов
- `CatalogCard.jsx` - карточка тайтла
- `TitlePage/` - страница отдельного тайтла
- `TitleInfo.jsx` - информация о тайтле
- `WatchButton.jsx` - кнопка перехода на внешний сайт
- `Search/` - компонент поиска и фильтров
- `Favorites/` - страница избранного

## Ключевые функции

- `useTelegram()` - кастомный хук для работы с Telegram API
- `animeService.js` - модуль для работы с внешним API
- `favoritesStore.js` - управление избранным (localStorage)
- `recommendationEngine.js` - базовый алгоритм рекомендаций

## Стек технологий

- React 18 + Vite
- Telegram Web App API
- Shikimori/AniList API
- CSS Modules/Tailwind для стилей
- Vercel/Netlify для хостинга
