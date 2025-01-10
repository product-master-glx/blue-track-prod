#Galaxeye Blue

Welcome to **Galaxeye Blue Track!!!**

# Packages we are using

1. **@emotion/react**: A performant and flexible CSS-in-JS library for React applications.
2. **@emotion/styled**: A utility function for defining styled components with Emotion.
3. **@highlight-run/react**: React SDK for highlight.io, full-stack monitoring platform.
4. **@mui/icons-material**: Material-UI icons for React components.
5. **@mui/material**: A popular React UI framework implementing Google's Material Design.
6. **@nivo/bar**: A powerful data visualization library for creating bar charts in React.
7. **@nivo/core**: Core components and utilities for building interactive data visualizations using React.
8. **@nivo/sunburst**: A React component for creating interactive sunburst charts.
9. **@nivo/waffle**: A React component for creating waffle charts, which are similar to pie charts.
10. **@turf/centroid**: A package for calculating the centroid of a GeoJSON geometry using Turf.js.
11. **@turf/turf**: A geospatial analysis library for advanced geospatial operations in JavaScript.
12. **axios**: A popular JavaScript library for making HTTP requests.
13. **dayjs**: A minimalist JavaScript library for parsing, validating, manipulating, and displaying dates and times.
14. **framer-motion**: A production-ready motion library for React applications, providing smooth animations and transitions.
15. **highlight.run**: A library for highlighting and running code snippets in web applications.
16. **jotai**: A simple and effective state management library for React applications.
17. **js-cookie**: A library for handling browser cookies in JavaScript.
18. **jwt-decode**: A library for decoding JSON Web Tokens (JWT) in JavaScript.
19. **leaflet**: An open-source JavaScript library for interactive maps.
20. **leaflet-geosearch**: A Leaflet plugin for performing geocoding and reverse geocoding.
21. **object-hash**: A package for generating unique hashes for JavaScript objects.
22. **react**: A popular JavaScript library for building user interfaces.
23. **react-dom**: A package providing DOM-specific methods for React applications.
24. **react-hot-toast**: A minimalist and easy-to-use toast notification library for React applications.
25. **react-leaflet**: A React wrapper for Leaflet, enabling the integration of Leaflet maps into React applications.
26. **react-leaflet-google-layer**: A React component for adding Google Maps as a layer in Leaflet maps.
27. **react-minimal-pie-chart**: A lightweight and customizable pie chart component for React applications.
28. **react-router-dom**: A popular library for adding routing capabilities to React applications.
29. **react-swipeable-views**: A React component for creating swipeable views and carousels.
30. **recharts**: A composable charting library for React applications.
31. **turf-polygon**: A package providing operations for polygons in Turf.js, a geospatial analysis library.
32. **@types/react**: TypeScript type definitions for React, enabling type safety when working with React components and props.
33. **@types/react-dom**: TypeScript type definitions for React DOM, providing type information for React's DOM-related features.
34. **@vitejs/plugin-react**: Vite plugin for building React applications with fast and efficient development and production workflows.
35. **eslint**: A pluggable JavaScript linter that helps identify and fix problems in your code.
36. **eslint-plugin-react**: ESLint plugin for React-specific linting rules and best practices.
37. **eslint-plugin-react-hooks**: ESLint plugin for enforcing the rules of React Hooks to ensure their correct usage.
38. **eslint-plugin-react-refresh**: ESLint plugin for React Fast Refresh, a feature that allows components to be hot reloaded without losing state.
39. **husky**: A Git hooks manager that allows you to easily set up and manage Git hooks in your project.
40. **prettier**: An opinionated code formatter that ensures consistent code style and automatically formats code files.
41. **vite**: A fast and minimalist build tool for modern web development, focusing on speed and simplicity.

# Folder Repository Structure

1. components - Contains the sub components used through out the webapp
2. constans - Constans used in the app are stored here in appropriate files
3. jotai - Contains the configuration files for Jotai (Global State Management)
4. pages - Contains the main components of the pages. All the subfolders in this folder are pages
5. public - Public static data like images
6. src - Main source folder contains the entry point of the app `main.jsx`
7. `.env` - Environment Variables
8. `.eslintignore` - Files to ignore while linting
9. `.eslintrc.json` - ESLint Configuration File
10. `.gitignore` - Files to ignore for commiting to github
11. `.prettierignore` - Files to ignore while formatting using prettier
12. `.prettierrc` - Prettier Configuration File to format the code
13. `index.html` - Entry point for the App
14. `vercel.json` - Configuration file for vercel
15. `vite.config.js` - Configuration file for the vite
16. .husky - Husky shell file to run with precommit hooks

# Commands to conquer

1. Install the packages

```
npm install
```

In case, we have conflict errors, please use

```
npm install -f
```

_Husky gets install and set the pre-commit commands when we install packages_

In case, husky gives error while installing

```@bash
npm install --save-dev husky -f
```

2. Run the dev server

```
npm run dev
```

3. Build the project

```
npm run build
```

4. Start the build server

```
npm run preview
```

5. Lint check

```
npm run lint
```

6. Run prettier

```
npm run prettier
```

7. Run prettier and lint check at the same time

```
npm run prent
```

8. Husky run (No need to use this directly)

```
npm run husky
```

# Workflow

-   We are using the AWS Endpoints for APIs, so we are calling the AWS endpoints whenever we need data from backend. Those endpoints and domains are stored in `constants/endpoints`.
-   We are using `jotai` for global state management. So, we can update states globally once we get the response from the API
-   We are using React Leaflet to shows interactive maps with different plugins
-   **Login Flow**:
    -   When user comes to home page, we check if user token exists in the cookies using `document.cookies`
    -   If user is already logged in and token exists in the cookies, we will open the home/landing page
    -   If user is not logged in, then we are redirecting user to `/sign-in` for logging in
    -   If user is already logged in and user tries to access `/sign-in`, we will redirect user to home page
    -   We have a component `components/CheckCookies`, which will check cookies and redirect accordingly
    -   This component also updates the global state `cookiesValuesAtom` for the user details which are encrypted using JWT Token and `userAccessTokensAtom` for user access token
-   **Landing Page**:
    -   On the landing page, we are showing the map and user's all previous orders stats in both card as well as graph format. We also add markers on the map for the user's orders
    -   We send 2 requests on this page, to get all orders and to get the stats related to orders. We update the global state `graphDataForLandingPageAtom` for the all stats and a local state for the orders from which we updates global state `listOfAllOrderDataAtom`.
    -   We also give option to add "New Region (Order)", which redirects to `/add`
    -   User can also search region of interest using the search bar given on the map. On selecting the region, we will zoom in to that region. User can see orders in that region with the help of markers
    -   In the sidebar, where we show the orders, we have a search bar to search in the orders and filter option for filtering using DoC (Days Of Culture)
    -   On clicking of any order, we update the global states for the region using `SET_REGION_DATA_GATHERED_FROM_LANDING_PAGE` and then redirect to `region-insight`
    -   In the graph format, we show the summary of the stats using the Pie-Chart
-   **Region Insight**:
    -   Using the order id and insight id from the global state which we store on the landing page after user selects the order, we fetch the GeoJson and the region insights like farm details containing farmer name, farmer supplier, farmer village, also we get the Water Quality Analysis (WQA) using `/get_signed_url` API which returns an API for AWS, which contains the data in the its responses
    -   We have to 2 APIs which return endpoints in the response, WQA and Meta, we again send request to those endpoints to get the data related to that order
    -   In total, we send 5 requests on this page
        1. To get GeoJson object for the order
        2. To get the endpoint for fetching the WQA data
        3. To get the WQA data from the above endpoint
        4. To get the endpoint for fetching the meta data
        5. To get the meta data from the above endpoint
    -   We update different global states according to response of above requests
        1. `mapZoomAtom`
        2. `mapCenterAtom`
        3. `metaDataForOrderAtom`
        4. `masterGeoJSONAtom`
        5. `geoJSONCurrentlyBeingDisplayedAtom`
    -   We are not storing WQA separately, we update the master GeoJSON with the WQA data
-   **Add Pond/New Region**:
    -   We are using different repository which is hosted on another server, we are using it's iframe to add new region
    -   When user clicks on New Region on the landing page, it opens the `/add` which contains the iframe
