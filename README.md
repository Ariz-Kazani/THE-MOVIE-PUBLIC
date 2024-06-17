# [THE MOVIE](https://the-movie-arizkazani.firebaseapp.com/)

## Introduction

Welcome to THE MOVIE! This project aims to provide a comprehensive database of movies, allowing users to search for information about their favorite films, discover new movies, and keep track of their watched movies.

With THE MOVIE project, you can easily find details such as movie titles, release dates, genres, cast and crew information, ratings, and reviews. Whether you're a movie enthusiast, a casual viewer, or a filmmaker, this application is designed to enhance your movie-watching experience.

Technologies Used:

- Front-end: HTML, CSS, VUE.js
- Back-end: Firebase
- Database: Firestore Database
- API: The Movie Database (TMDb) API

Let's get started and explore the world of movies with THE MOVIE"!

## Installation

1. Make sure you have [Node.js](https://nodejs.org/en/download/package-manager) installed and running on your computer.

2. Clone this repository locally.

3. Run: `npm install` to install all dependencies.

4. Create an `.env` file in the root folder of the project (same folder as this readme), this will contain your TMDb API key as well as your firebase config object. You can get a [TMDb API key here](https://developer.themoviedb.org/reference/intro/getting-started), and you can get started with [Firebase here](https://firebase.google.com/). Once you have the TMDb API key firebase config object add it to `VITE_TMDB_API_KEY` and `VITE_FIREBASE_CONFIG_DATA_OBJECT` variable respectively, in the .env file. Make sure the firebase config object is in valid JSON form. It should look something like this:

```
// Your TMDb API Key
VITE_TMDB_API_KEY="YOUR TMDb API KEY HERE"

// Your Firebase config
VITE_FIREBASE_CONFIG_DATA_OBJECT={"apiKey":...}

```

5. Make sure you have Firebase auth, hosting and Firestore Database correctly configured.

## Usage & Features

The Movie application offers a range of features to enhance your movie-watching experience:

1. **Search Movies**: Easily search for movies by title. The application utilizes The Movie Database (TMDb) API to provide accurate and up-to-date movie information.

2. **Discover New Movies**: Explore a curated collection of popular and trending movies. Discover hidden gems and stay up-to-date with the latest releases.

3. **My Movies**: Keep track of movies you "purchase", (all movies are free because you aren't actually able to purchase them)

4. **Watch Movies**: Watch purchased movies.

5. **Mobile-Friendly**: The Movie application is designed to be responsive and mobile-friendly. Enjoy the same great experience on your desktop, tablet, or smartphone.

## License

There is no license, so feel free to take my code and build on it!

## Credits

Code written by Ariz Kazani. Special thanks to Omar Qayum for the original project idea!
