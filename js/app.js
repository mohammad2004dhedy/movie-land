let timeoutId;
function ActiveLoginAlert() {
  let favoriteAlert = document.querySelector(".favoriteAlert");
  favoriteAlert.classList.add("active");
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    favoriteAlert.classList.remove("active");
  }, 3500);
}

let idCounter = localStorage.getItem("MovieLandIdCounter")
  ? JSON.parse(localStorage.getItem("MovieLandIdCounter"))
  : 0;
let usersData = localStorage.getItem("MovieLandUsersData")
  ? JSON.parse(localStorage.getItem("MovieLandUsersData"))
  : [];

// Template for a user object
let userTempObject = {
  id: -1,
  name: "movieland user",
  email: "noemail@gmail.com",
  password: "no password",
  favorite: [],
};

// Retrieve the currently logged-in user from localStorage, if exists
let loggedInUser = localStorage.getItem("MovieLandLoggedINUser")
  ? JSON.parse(localStorage.getItem("MovieLandLoggedINUser"))
  : userTempObject;
let favoriteMovies = loggedInUser.favorite;

let isLoggedIn = localStorage.getItem("isMovieLandUserLoggedIn") ? true : false;

showProfileInfo(loggedInUser);
function showProfileInfo(userInfo) {
  document.getElementById("UserName").innerHTML = userInfo.name;
  document.getElementById("userEmail").innerHTML = userInfo.email;
  document.getElementById("navUserName").innerHTML = userInfo.name;
  ShowProfileFavoriteMovies();
}

// -------------------- Login / Signup Page Toggle --------------------

let loginSignUpPage = document.querySelector(".loginSignUp");
let signupForm = document.querySelector("#SignUpForm");
let SignUpLink = document.querySelector(".SignUpFormBTN");
let LoginFormLink = document.querySelector(".LoginFormBtn");

// Show signup form when clicking on the signup link
SignUpLink.addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.classList.add("active");
});

// Show login form when clicking on the login link
LoginFormLink.addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.classList.remove("active");
});

// Close the login/signup page
document.querySelector(".closeLoginPage").onclick = () => {
  loginSignUpPage.classList.add("disabled");
};

// Open the login/signup page
document.querySelector(".HeaderloginBtn").onclick = (e) => {
  e.preventDefault();
  loginSignUpPage.classList.remove("disabled");
};

// -------------------- Handle User Data for Login / Signup Forms --------------------

let SignUpForm = document.getElementById("SignUpForm");
let loginForm = document.getElementById("loginForm");

// Handle signup form submission
SignUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form input values
  let signUpName = document.getElementById("signUpName").value;
  let signUpEmail = document.getElementById("signUpEmail").value;
  let signUpPassword = document.getElementById("signUpPassword").value;
  // Add new user data to the users array
  let accountAlreadyExist = false;
  usersData.forEach((data) => {
    if (data.email == signUpEmail) {
      accountAlreadyExist = true;
    }
  });
  let favoriteAlert = document.querySelector(".favoriteAlert");
  if (accountAlreadyExist == true) {
    favoriteAlert.innerHTML = "account is already exist :!";
  } else {
    usersData.push({
      id: idCounter,
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      favorite: [],
    });
    idCounter++;
    localStorage.setItem("idCounter", JSON.stringify(idCounter));
    // Store updated users data in localStorage
    localStorage.setItem("MovieLandUsersData", JSON.stringify(usersData));

    // Show success message
    favoriteAlert.innerHTML = `Your account has been created successfully <i class="fa-solid fa-check"></i>`;
    LoginFormLink.click(); // Switch to the login form
  }
  ActiveLoginAlert();
});

let accountFound = false;

// Handle login form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let favoriteAlert = document.querySelector(".favoriteAlert");
  // Get form input values
  let loginEmail = document.getElementById("login-email").value;
  let loginPassword = document.getElementById("login-password").value;

  usersData.forEach((data) => {
    if (data.email == loginEmail && data.password == loginPassword) {
      accountFound = true;
      loggedInUser = { ...data };
      localStorage.setItem(
        "MovieLandLoggedINUser",
        JSON.stringify(loggedInUser)
      );
    }
  });

  if (!accountFound) {
    // Show error message if account is not found
    favoriteAlert.innerHTML = `Wrong email or password :(`;
  } else {
    // Show success message and log the user in
    favoriteAlert.innerHTML = `Welcome ${loggedInUser.name}`;
    loginSignUpPage.classList.add("disabled"); // Close login/signup page
    navlogedInMode.classList.add("logedIn"); // Show logged-in state
    localStorage.setItem("isMovieLandUserLoggedIn", JSON.stringify(true)); // Store login status
    favoriteMovies = loggedInUser.favorite;
    showProfileInfo(loggedInUser);
    document.getElementById("allBtn").click();
  }
  ActiveLoginAlert();
});

// Handle account logout
AccountLogOut.addEventListener("click", () => {
  localStorage.removeItem("isMovieLandUserLoggedIn"); // Remove login status
  localStorage.removeItem("MovieLandLoggedINUser");
  window.location.reload(); // Reload the page to reset state
});

// Check login status on page load and update UI accordingly
window.addEventListener("load", () => {
  isLoggedIn
    ? navlogedInMode.classList.add("logedIn")
    : navlogedInMode.classList.remove("logedIn");
});

const apiKey = "6345300bfd3be8919424dc0b3e207528";
const apiUrl = "https://api.themoviedb.org/3";

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
function displayMovies(movies, mood) {
  const searchResultsDiv = document.querySelector(".moviesList .content");
  const profileCart = document.querySelector("#userCart .cartProducts");
  if (mood === "profileCart") {
    profileCart.innerHTML = "";
  } else {
    searchResultsDiv.innerHTML = "";
  }
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

      if (mood == "profileCart") {
        profileCart.appendChild(movieElement);
      } else {
        searchResultsDiv.appendChild(movieElement);
      }

      //handle saving movie to favorities and activate the movieDetail page to show movie info
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
            loggedInUser.favorite = [...favoriteMovies];
            localStorage.setItem(
              "MovieLandLoggedINUser",
              JSON.stringify(loggedInUser)
            );
            usersData = usersData.map((user) => {
              if (user.id == loggedInUser.id) {
                return loggedInUser;
              } else {
                return user;
              }
            });
            localStorage.setItem(
              "MovieLandUsersData",
              JSON.stringify(usersData)
            );
          } else {
            // اذا فش عندو كلاس اكتيف
            favoriteAlert.innerHTML =
              "movie removed from favorites successfully";
            favoriteMovies = favoriteMovies.filter((fav) => fav.id != movie.id);
            loggedInUser.favorite = [...favoriteMovies];
            localStorage.setItem(
              "MovieLandLoggedINUser",
              JSON.stringify(loggedInUser)
            );
            usersData = usersData.map((user) => {
              if (user.id == loggedInUser.id) {
                return loggedInUser;
              } else {
                return user;
              }
            });
            localStorage.setItem(
              "MovieLandUsersData",
              JSON.stringify(usersData)
            );
          }

          ActiveLoginAlert();
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
// -------------------- Show and Hide User Profile --------------------

let navUserName = document.getElementById("navUserName");
let Userprofile = document.querySelector(".Userprofile");
let closeProfile = document.querySelector(".closeProfile");

// Toggle user profile visibility when clicking the username
navUserName.addEventListener("click", () => {
  Userprofile.classList.toggle("active");
  ShowProfileFavoriteMovies();
});

// Close user profile when clicking the close button
closeProfile.addEventListener("click", () => {
  Userprofile.classList.remove("active");
  allBtn.click();
});

// display favorite movies in the user caretColor:
function ShowProfileFavoriteMovies() {
  displayMovies(favoriteMovies, "profileCart");
}
ShowProfileFavoriteMovies();
