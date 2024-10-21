// const apiKey = 'YOUR_API_KEY';
// const url = `https://api.themoviedb.org/3/movie/popular?api_key=${'6345300bfd3be8919424dc0b3e207528'}&language=en-US&page=1`;

// fetch(url)
//   .then(response => response.json())
//   .then(data => console.log(data.results))
//   .catch(error => console.error('Error:', error));

// here the movie list part <convert between all and favorities movies >
let moviesList = document.querySelector("#moviesList");
let movies = moviesList.querySelectorAll(".container .content .movieBox");
let allBtn = document.getElementById("allBtn");
let favoriteBtn = document.getElementById("favoriteBtn");
allBtn.addEventListener("click", () => {
  movies.forEach((movie) => {
    movie.style.display = "block";
  });
  favoriteBtn.classList.remove("active");
  allBtn.classList.add("active");
});
favoriteBtn.addEventListener("click", () => {
  movies.forEach((movie) => {
    if (movie.getAttribute("data-favorite") == "true") {
      movie.style.display = "block";
    } else {
      movie.style.display = "none";
    }
  });
  allBtn.classList.remove("active");
  favoriteBtn.classList.add("active");
});
// -----------------------------------------