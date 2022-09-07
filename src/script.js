//Declare global variables here

const searchUrl = "https://api.github.com/search/users?q="
const repoUrl = "https://api.github.com/users/" //users/username/repos
const form = document.querySelector("#github-form")
const users = document.querySelector("#user-list")
const repos = document.querySelector("#repos-list")
const divRepos = document.querySelector('.card')
let repoUser = " "
let repoArray = []
const configurationObject = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
    }
  };

//Event Listeners

form.addEventListener("submit", searchFetch)
document.addEventListener("click", repoClickHandler)

//functions for searching users

function searchFetch(e) {
    e.preventDefault()
    console.log("you submitted!")
    let search = e.target.search.value
    console.log(searchUrl + `${search}`, configurationObject)
    return (fetch(searchUrl + `${search}`)
        .then((resp) => resp.json())
        .then((data) => searchHandler(data))
        .catch(function () {
            console.log("error displaying search results")
            alert("Error displaying search results")
        }))
}

function searchHandler(query) {
    console.log(query)
    console.log(query.items)
    let queryElements = createSearchElements(query.items)
    return renderQuery(queryElements)
}

function createSearchElements(datas) {
    console.log("Im in create search elements")
    return datas.map((data) => {
        let i = `<div class = "card">
        <h2>${data.login}</h2>
        <img src=${data.avatar_url}><br>
        <a href=${data.html_url} target="_blank">Profile Link</a><br>
        <button class ="repo-btn" id="${data.login}">Display Repositories</button>
        </div>`
        return i
    })
}

function renderQuery(e) {
    console.log("i'm in render query")
    users.innerHTML = " "
    repos.innerHTML = " "
    e.forEach(element => {
        renderUlUsers(element)
    })
}

function renderUlUsers(element) {
    console.log("im in render Ul")
    users.innerHTML += element
}