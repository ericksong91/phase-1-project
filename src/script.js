//
//Global Variables
//

const animeURL = "https://api.jikan.moe/v4/anime?q=";
const mangaURL = "https://api.jikan.moe/v4/manga?q=";
let url = 0;
let lightMode = false;
let aniMan = "animeTitles";

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

//
//Functions for Searching Titles Below
//

function searchStart(e) {
    e.preventDefault()
    if (aniMan === "animeTitles") {
        console.log("Looking for Anime")
        url = animeURL
    } else {
        console.log("Looking for Manga")
        url = mangaURL
    }

    let search = e.target.search.value

    if (search.length === 0) {
        console.log("Nothing Submitted")
    } else {
        console.log("You Submitted!")
        search = search.split(" ").join("+")
        return fetchData(search)
    }
}

function fetchData(search) {
    return (
        fetch(url + `${search}` + '&sfw' + "&genres_exclude=12")
            .then((resp) => resp.json())
            .then((data) => searchHandler(data))
            .then(() => form.reset())
            .catch(function () {
                console.log("Error")
                alert("Error")
            }))
}

function searchHandler(query) {
    console.log(query);
    console.log(query.data);

    if (query.data.length === 0) {
        return alert("No Results")
    }
    let queryElements = createSearchElements(query.data);
    return renderQuery(queryElements)
}

function createSearchElements(datas) {
    console.log("I'm in create search elements")
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

function renderQuery(arr) {
    console.log("I'm in render query")
    animeList.innerHTML = " "

    arr.forEach(element => {
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



