//DOM Load Listener

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM has loaded!")
})

//Declare global variables here

const searchUrl = "https://api.jikan.moe/v4/anime?q="
const form = document.querySelector("#MAL-form")
const animeList = document.querySelector("#animeList")
//Configuring the GET Request with a custom header
const configurationObject = {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
};

//Event Listeners

form.addEventListener("submit", searchStart)

//Functions for Searching Anime Titles Below

function searchStart(e) {
    e.preventDefault()
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
        console.log(searchUrl + `${search}` + '&sfw', configurationObject)
        return fetchData(search)
    }
}

function fetchData(e) {
    return (
        fetch(searchUrl + `${e}` + '&sfw')
            //Converts JSON
            .then((resp) => resp.json())
            //Sends Object data to searchHandler function
            .then((data) => searchHandler(data))
            //Clears search field
            .then(() => form.reset())
            //Catches any errors that happen during this process
            .catch(function () {
                console.log("error displaying search results")
                alert("Error displaying search results")
            }))
}

function searchHandler(query) {
    console.log(query)
    console.log(query.data)
    //Grabs Object > Data Array (Anime information)
    //Sends it to a function that creates the HTML embed
    let queryElements = createSearchElements(query.data)
    //Returns to original fetch request after completing DOM manipulation
    return renderQuery(queryElements)
}

function createSearchElements(datas) {
    console.log("I'm in create search elements")
    //Uses a map method to grab all of the titles, image URLs and Page URLs of the anime
    //Returns variable i that includes all of the HTML needed for page insertion
    //Includes a new div class of "card" which formats it according to the css style
    //NOTE TO SELF: Change the Link to a button, add class card to styling sheet
    return datas.map((data) => {
        let i = `
        <div class = "card">
        <h3>${data.title}</h3>
        <img src=${data.images.jpg.image_url} alt="${data.title}" 
            title="${data.title}" class="animeImg">
        <a href=${data.url} target="_blank">MAL Page</a>
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
        renderUlUsers(element)
    })
}

function renderUlUsers(element) {
    console.log("I'm in render Ul")
    //Renders in the unordered list with variable "i" from createSearchElements
    //Inserts HTML
    animeList.innerHTML += element
}