const apiKey = "6345300bfd3be8919424dc0b3e207528";
const apiUrl = "https://api.themoviedb.org/3";

// Fetch the movie name from the URL parameters
const params = new URLSearchParams(window.location.search);
const movieTitle = params.get("movie");

async function getMovieDetails(title) {
    try {
        // Fetch basic movie data
        const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`);
        const data = await response.json();
        if (data.results.length > 0) {
            const movie = data.results[0];

            // Fetch additional movie details, including runtime
            const movieDetailsResponse = await fetch(`${apiUrl}/movie/${movie.id}?api_key=${apiKey}`);
            const movieDetails = await movieDetailsResponse.json();
            console.log(movieDetails);
            // Update basic movie details (عنوان وبوستر وتقييم ووصف واصوات والمدة)
            updateBasicMovieDetails(movie, movieDetails);

            // Fetch directors and actors inforamtion
            const creditsResponse = await fetch(`${apiUrl}/movie/${movie.id}/credits?api_key=${apiKey}`);
            const credits = await creditsResponse.json();
            console.log(credits);

            // Display directors and actors
            displayDirectors(credits.crew);
            displayActors(credits.cast);

            // Update additional movie information
            updateAdditionalMovieInfo(movie, movieDetails);

            // Fetch and display movie videos (trailers)
            await fetchAndDisplayVideos(movie.id);
        } else {
            document.getElementById("movieTitle").textContent = "No movie found";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("movieTitle").textContent = "Error fetching movie details";
    }
}

function updateBasicMovieDetails(movie, movieDetails) {
    document.getElementById("movieImage").src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
        : "images/noImage.webp";

    document.getElementById("movieTitle").textContent = movie.title || "No title available";
    document.getElementById("movieRating").textContent = movie.vote_average ? movie.vote_average.toFixed(1) : "0.0";
    document.getElementById("movieYear").textContent = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : "No data";
    document.getElementById("voteCount").textContent = movie.vote_count ? `${movie.vote_count} votes` : "N/A";
    document.getElementById("movieDescription").textContent = movie.overview || "No description available";

    const runtime = movieDetails.runtime ? `${movieDetails.runtime} min` : "N/A";
    document.getElementById("movieDuration").textContent = runtime;
}

function displayDirectors(crew) {
    const directorsContent = document.getElementById("DirectorsWritersContent");
    directorsContent.innerHTML = "";

    const directors = crew
        .filter(person => person.job === "Director")
        .map(director => {
            const div = document.createElement("div");
            const img = document.createElement("img");
            img.src = director.profile_path ? `https://image.tmdb.org/t/p/w200${director.profile_path}` : "images/noImage.webp";
            img.alt = director.name || "Director";
            img.style.width = "100px";

            const name = document.createElement("span");
            name.textContent = director.name || "N/A";

            div.appendChild(img);
            div.appendChild(name);
            return div;
        });

    directors.forEach(directorDiv => directorsContent.appendChild(directorDiv));
}

function displayActors(cast) {
    const actorsContent = document.getElementById("ActorsContent");
    actorsContent.innerHTML = "";

    const actors = cast.slice(0, 3).map(actor => {
        const div = document.createElement("div");
        const img = document.createElement("img");
        img.src = actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "images/noImage.webp";
        img.alt = actor.name || "Actor";
        img.style.width = "100px";

        const name = document.createElement("span");
        name.textContent = actor.name || "N/A";

        div.appendChild(img);
        div.appendChild(name);
        return div;
    });

    actors.forEach(actorDiv => actorsContent.appendChild(actorDiv));
}

function updateAdditionalMovieInfo(movie, movieDetails) {
    document.getElementById("LanguagesContent").textContent =
        movie.original_language ? `${movie.original_language.toUpperCase()}` : "N/A";

    const genres = movieDetails.genres.map(genre => genre.name).join(" , ") || "N/A";
    document.getElementById("movieGenre").textContent = genres;

    document.getElementById("DataType").textContent = "movie";
     
    document.getElementById("dataRated").textContent = movieDetails.adult ? "R" : "PG-13"; //توضيح اذا كان الفلم مخصص للكبار او لا من خلال الادولت فلاج
}

async function fetchAndDisplayVideos(movieId) {
    const videosResponse = await fetch(`${apiUrl}/movie/${movieId}/videos?api_key=${apiKey}`);
    const videos = await videosResponse.json();
    console.log(videos);
    const trailer = videos.results.find(video => video.type === "Trailer" && video.site === "YouTube");
    if (trailer) {
        const trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
        document.querySelector("iframe").src = trailerUrl;
    } else {
        console.log("No trailer found for this movie.");
    }
}

if (movieTitle) {
    getMovieDetails(movieTitle);
} else {
    document.getElementById("movieTitle").textContent = "No movie selected";
}