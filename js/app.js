const apiKey = "6345300bfd3be8919424dc0b3e207528";
const apiUrl = "https://api.themoviedb.org/3";
let favoriteMovies = localStorage.favoriteMovies
  ? JSON.parse(localStorage.favoriteMovies)
  : [];

// trend movies
async function getTrendingMovies() {
  try {
    const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}

async function showTrendingMovies() {
  const trendingMovies = await getTrendingMovies();
  displayMovies(trendingMovies);
}

window.addEventListener("load", showTrendingMovies());

// for fetching the result of search
async function searchMovies(query) {
  try {
    const response = await fetch(
      `${apiUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching movie search results:", error);
    return [];
  }
}

// to show the result of the search
function displayMovies(movies) {
  const searchResultsDiv = document.querySelector(".content");
  searchResultsDiv.innerHTML = "";
  if (movies.length > 0) {
    movies.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("movieBox");
      movieElement.innerHTML = `
        <i class="fa-regular fa-bookmark addFav"></i>
        <img src="${
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : "images/noImage.webp"
        }" alt="${movie.title}" />
        <span class="title">${movie.title}</span>
      `;

      favoriteMovies.forEach((favorite) => {
        if (movie.id == favorite.id) {
          let favoriteBtn = movieElement.querySelector(".addFav");
          favoriteBtn.classList.add("active");
        }
      });

      searchResultsDiv.appendChild(movieElement);

      //handle saving movie to favorities and activate the movieDetail fail to show movie info
      let timeOutId;

      movieElement.addEventListener("click", function (event) {
        let favoriteBtn = this.querySelector(".addFav");
        let favoriteAlert = document.querySelector(".favoriteAlert");

        if (event.target != favoriteBtn) {
          window.open(
            "movieDetail.html?movie=" + encodeURIComponent(movie.title),
            "_blank"
          );
        } else {
          favoriteBtn.classList.toggle("active");
          if (favoriteBtn.classList.contains("active")) {
            favoriteAlert.innerHTML = "movie added to favorites successfully";
            favoriteMovies.push(movie);
            localStorage.setItem(
              "favoriteMovies",
              JSON.stringify(favoriteMovies)
            );
          } else {
            // اذا فش عندو كلاس اكتيف
            favoriteAlert.innerHTML =
              "movie removed from favorites successfully";
            favoriteMovies = favoriteMovies.filter((fav) => fav.id != movie.id);
            localStorage.setItem(
              "favoriteMovies",
              JSON.stringify(favoriteMovies)
            );
          }

          favoriteAlert.classList.add("active");
          if (timeOutId) {
            clearTimeout(timeOutId);
          }
          timeOutId = setTimeout(() => {
            favoriteAlert.classList.remove("active");
          }, 3000);
        }
      }); //call back function for the click event
    }); // for each scope close
  } else {
    searchResultsDiv.innerHTML =
      "<p style='color: white; font-size: 24px;'>No results found</p>";
  } // else scope close
}

// searching for movies

let searchForm = document.querySelector("#movieSearchForm");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

searchForm.querySelector("input").addEventListener("keyup", async function () {
  const query = document.getElementById("search").value;
  if (query) {
    const movies = await searchMovies(query);
    displayMovies(movies);
  } else {
    showTrendingMovies();
  }
});

// here the movie list part <convert between all and favorities movies >
let moviesList = document.querySelector("#moviesList");
let movies = moviesList.querySelectorAll(".container .content .movieBox");
let allBtn = document.getElementById("allBtn");
let favoriteBtn = document.getElementById("favoriteBtn");
allBtn.addEventListener("click", () => {
  showTrendingMovies();
  favoriteBtn.classList.remove("active");
  allBtn.classList.add("active");
});

favoriteBtn.addEventListener("click", () => {
  displayMovies(favoriteMovies);
  allBtn.classList.remove("active");
  favoriteBtn.classList.add("active");
});
// -----------------------------------------
