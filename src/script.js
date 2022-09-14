
//
//DOM Load Listener
//

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM has loaded!");
})

//
//Global Variables
//

const animeURL = "https://api.jikan.moe/v4/anime?q=";
const mangaURL = "https://api.jikan.moe/v4/manga?q=";
let url = 0; //will be used for searching for anime or manga later
let resObj = {}; //resObj will be the original array when I need to restore the page
let lightMode = false; //boolean for determining light/dark mode
let aniMan = "animeTitles"; //Default to search for anime titles

//Configuring the GET Request with a custom header, if needed
const configurationObject = {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
};

//Variables for targetting DOM elements
const form = document.querySelector("#MAL-form");
const toggle = document.querySelector("#toggleMode > label > span");
const body = document.querySelector("#body");
const main = document.querySelector("#main");
const bottom = document.querySelector("#bottom");
const title = document.querySelector("#title");
const links = document.querySelectorAll("a");
const animeList = document.querySelector("#animeList");
const dropDown = document.querySelector("#dropDown")
const LMButton = document.querySelector("learnMore")

//
//Event Listeners
//

form.addEventListener("submit", searchStart);
toggle.addEventListener("click", pageMode);
dropDown.addEventListener("change", ((select) => aniMan = select.target.value))
document.addEventListener("click", learnMoreListen)

//
//Function for Learn More Button
//

//Currently a placeholder until I add more features
function learnMoreListen(e) {
    if (e.target.className === "learnMore") {
      console.log("You're learning more!")
    }
  }

//
//Functions for Searching Titles Below
//

function searchStart(e) {
    e.preventDefault()
    //Code to determine whether or not we're looking for manga/anime
    console.log(aniMan)
    if (aniMan === "animeTitles") {
        console.log("Looking for Anime")
        url = animeURL
    } else {
        console.log("Looking for Manga")
        url = mangaURL
    }
    //In case search string has spaces, splits it into an array
    let search = e.target.search.value
    //Check if anything was submitted
    if (search.length === 0) {
        console.log("Nothing Submitted")
    } else {
        console.log("You Submitted!")
        //Changes any submissions with spaces to a long string with + inbetween for the URL
        search = search.split(" ").join("+")
        console.log(search)
        console.log(url + `${search}` + '&sfw' + "&genres_exclude=12", configurationObject)
        return fetchData(search)
    }
}

function fetchData(e) {
    return (
        fetch(url + `${e}` + '&sfw' + "&genres_exclude=12")
            //Converts JSON
            .then((resp) => resp.json())
            //Sends Object data to searchHandler function
            .then((data) => searchHandler(data))
            //Clears search field
            .then(() => form.reset())
            //Catches any errors that happen during this process
            .catch(function () {
                console.log("Error")
                alert("Error")
            }))
}

function searchHandler(query) {
    console.log(query);
    console.log(query.data);
    resObj = query.data

    //Returns an error if no results found

    if (query.data.length === 0) {
        return alert("No Results")
    }

    //Grabs Object > Data Array (Anime information)
    //Sends it to a function that creates the HTML embed
    let queryElements = createSearchElements(query.data);
    //Returns to original fetch request after completing DOM manipulation
    return renderQuery(queryElements)
}

function createSearchElements(datas) {
    console.log("I'm in create search elements")
    //Uses a map method to grab all of the titles, image URLs and Page URLs of the anime
    //Returns variable i, that includes all of the HTML needed for page insertion
    //Includes a new div class of "card" which formats it according to the css style
    return datas.map((data) => {
        let i = `
        <div id="${data.mal_id} "class="card">
        <h3 class="animeTitle">${data.title}</h3>
        <a href="${data.url}" target="_blank">
            <img src=${data.images.jpg.image_url} alt="${data.title}" 
                title="${data.title}" class="animeImg">
        </a>
        <a href="${data.url}" target="_blank">
        <button class="learnMore">Learn More</button>
        </a>
        </div>`
        return i
    })
}

function renderQuery(e) {
    console.log("I'm in render query")
    //Clears the page before insertion of new elements
    animeList.innerHTML = " "
    //forEach method to insert each element from Object
    e.forEach(element => {
        renderDivTitles(element)
    })

    if (lightMode === true) {
        console.log("We're in lightmode!")
        let card = document.querySelectorAll(".card")
        let learnMore = document.querySelectorAll(".learnMore")
        for (let i = 0; i < card.length; i++) {
            card[i].setAttribute("class", "card lightMode")
            learnMore[i].setAttribute("class", "learnMore lightMode")
        }
    }

}

function renderDivTitles(element) {
    console.log("I'm in render Div titles")
    //Renders in the unordered list with variable "i" from createSearchElements
    //Inserts HTML
    animeList.innerHTML += element;
}

//
// Function for Changing Page to Dark/Light mode
//

function pageMode() {
    console.log("You toggled!")
    if (lightMode === false) {
        body.setAttribute("class", "lightMode");
        main.setAttribute("class", "lightMode");
        bottom.setAttribute("class", "lightMode");
        title.setAttribute("class", "lightMode");
        links[0].setAttribute("class", "lightMode");
        links[1].setAttribute("class", "lightMode");
        changeCards();
        lightMode = true;
    } else {
        body.removeAttribute("class", "lightMode");
        main.removeAttribute("class", "lightMode");
        bottom.removeAttribute("class", "lightMode");
        title.removeAttribute("class", "lightMode");
        links[0].removeAttribute("class", "lightMode");
        links[1].removeAttribute("class", "lightMode");
        changeCards();
        lightMode = false;
    }

    return lightMode
}

function changeCards() {

    console.log("You're in change cards!")
    console.log(lightMode)

    let learnMore = document.querySelectorAll(".learnMore");
    let card = document.querySelectorAll(".card");

    if (lightMode === false) {
        for (let i = 0; i < card.length; i++) {
            card[i].setAttribute("class", "card lightMode");
            learnMore[i].setAttribute("class", "learnMore lightMode");
        }
    } else {
        for (let i = 0; i < card.length; i++) {
            card[i].setAttribute("class", "card");
            learnMore[i].setAttribute("class", "learnMore");
        }
    }
    return
}


//
// Function for Rendering a Larger Card for the Show's Info
//



// For the More Info Page, I want it to clear the entire page and bring in a big card
// Description of the show, Genre, Title, Alt. Titles, Ratings
// Need 1 more eventlisteners

