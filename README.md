## Car Library – React Native / Expo App

Car Library is a mobile app built with **Expo**, **React Native**, **React Navigation**, and **TanStack Query** for managing a collection of cars with search, filter, sort, and favorites support.

---

### Setup Instructions

- **Prerequisites**

  - **Node.js** (LTS recommended)
  - **npm** or **yarn** or **bun**

- **Install dependencies**

  ```bash
  npm install
  # or
  yarn install
  # or
  bun install
  ```

- **Run the app (development)**

  ```bash
  # Start Metro bundler
  bun start
  # or
  npx expo start
  ```

  Then choose one of:

  - Press **i** to open in iOS Simulator (macOS only)
  - Press **a** to open in Android emulator
  - Scan the QR code with the **Expo Go** app on your device

- **Platform-specific shortcuts**

  ```bash
  bun run ios     # iOS simulator
  bun run android # Android emulator
  bun run web     # Web
  ```

---

### Project Structure (high level)

- **`App.tsx`** – App entrypoint / navigation container
- **`src/navigation`** – Bottom tab + stack navigation setup
- **`src/screens`**
  - `CarLibraryScreen.tsx` – Car listing, search, filters, sorting, favorites
  - `CarDetailScreen.tsx` – Car details, delete flow, image, tags, etc.
  - `AddCarScreen.tsx` – Create a new car entry form
  - `HomeScreen.tsx`, `ProfileScreen.tsx`, `ServiceScreen.tsx` – Other tabs
- **`src/components`**
  - `CarCard.tsx` – Card UI for each car in the grid
  - `FilterModal.tsx`, `SortModal.tsx`, `DeleteConfirmModal.tsx`
- **`src/hooks`**
  - `useCars.ts` – Fetching and caching cars (TanStack Query)
  - `useFavorites.tsx` – Local favorites handling (AsyncStorage)
  - `useDebounce.ts` – Debounced values for search
- **`src/services`**
  - `carService.ts` – API client for car endpoints

---

### Features

- **Car Library Grid**

  - 2-column **FlatList** grid with virtualization props optimized for performance
  - Each item uses `CarCard` with image, name, and type badge.

- **Search**

  - Debounced search input using a custom `useDebounce` hook
  - Search indicator (“Searching…”) while querying
  - Empty state with illustration when no results match the query

- **Sorting & Filtering**

  - **SortModal** to sort by `createdAt` and other supported fields (ASC/DESC)
  - **FilterModal** to filter by car type and tags
  - Visual indicator when filters are active

- **Favorites**

  - Heart icon toggle in the library toolbar to show **favorites only**
  - `useFavorites` hook backed by `AsyncStorage`
  - Multiple empty states:
    - No favorites yet
    - No favorites matching current filters

- **Car Details**

  - Detailed view with large image (with fallback), description, tags, type, and metadata
  - Delete confirmation modal using `DeleteConfirmModal`

- **Add Car**

  - Form screen to add a new car with fields like name, description, type, tags, and image URL
  - Uses the shared service and query cache to update list after creating a car

- **UX / UI Enhancements**
  - **expo-image** for performant image rendering with fallback assets
  - Animated “Cancel” text in search bar using `react-native-reanimated`
  - Centered empty states with nodata illustration
  - Safe area handling via `react-native-safe-area-context`

---

### Environment / API

- API configuration is defined in `src/config/api.ts` and consumed by `src/services/carService.ts`.
- If you point to a different backend:
  - Update the **base URL** and any required headers in `api.ts`.
  - Ensure the response types align with `src/types/Car.ts`.

---

### Video Link

- https://drive.google.com/file/d/1Mfpr4K0tGynPPy6Hny02GEnpVR6n76Ls/view?usp=sharing
