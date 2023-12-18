var inputObj = document.getElementById('search');
var resultBox = document.getElementById('result-list');
let favList = document.getElementById('fav-list');
let fav = document.querySelector('.favorite');
var filter;
var data;
var movieId = "";
var moviePlot;
var moviePoster;
var movieDetails;
var movieTitle;
var posterImage = document.getElementById('poster-container');
var details = document.getElementById('details-container');
var currV;

// here we would listening to the input box every time a key is pressed
inputObj.addEventListener('keyup',function(){
    filter = inputObj.value;
    resultBox.innerHTML = '';

        if(filter!=''){
            //only when we have something typed in the search
            let response = fetch(`https://www.omdbapi.com/?apikey=22158796&s=${filter}`).then(response => response.json().then(function(result){
                data = result;
                
                //if the response is true with the required data we append them to the result box
                if(result.Response === 'True'){
                    resultBox.innerHTML = '';
                    for(let i of data.Search){
                        const li = document.createElement('li');
                        li.innerHTML = `${i.Title}` 
                        li.data = i.imdbID;
                        resultBox.append(li);

                    }
                }//if the result of the API call is false and the error is Too many results, we display the same.
                else if(result.Error === 'Too many results.'){
                    resultBox.innerHTML = '';
                    const temp = document.createElement('div');
                    temp.innerHTML = 'There are too many movies keep typing...'
                    resultBox.append(temp);
                }//if the result of the API call is false and the error is movie not found, we display the same.
                else{
                    resultBox.innerHTML = '';
                    const temp = document.createElement('div');
                    temp.innerHTML = 'Movie not found. Try something else'
                    resultBox.append(temp);
                }   
            }
        ))}

        
})



// this is the fucntion to update the list of favorite movies.
function updateFavList(){
    let obj = Object.keys(sessionStorage);//gathering all the items from session storage
    favList.innerHTML = '';
    //appending all the favorite movies as a list element.
    for(let i of obj){
        let ele = document.createElement('li');
        ele.data = i;
        ele.innerHTML = `<span id=${i} class="movie-name" >${sessionStorage.getItem(i)}</span><span id=${i} class="close material-symbols-outlined">
        close
        </span>`;
        favList.append(ele)
    }
    //event listeners to open the favorite movie
    const elementsName = document.querySelectorAll('.movie-name');
    for(let i of elementsName){
        i.addEventListener('click',function(e){
            let temp = e.target;
            getMovieDetails(temp.getAttribute('id'))
        })
    }

    //event listner to remove the movie from favorites
    const elementsId = document.querySelectorAll('.close');
    for(let i of elementsId){
        i.addEventListener('click',function(e){
            let temp = e.target;
            removeMovie(temp.getAttribute('id'));
        })
    }
}


//this is the function to remove the movie from favorite list and on session storage
function removeMovie(id){
    sessionStorage.removeItem(id);
    updateFavList();
    getMovieDetails(movieId);
}

// to open or collapse the favorite movie list.
fav.addEventListener('click',function(){
    if(favList.style.display==""){
    favList.style.display = "inline";
        updateFavList();
    }else{
    favList.style.display = "";   
    }

})

// to display the selected movie from the search result.
resultBox.addEventListener('click',function(e){
    const temoObj = e.target;
    const id = temoObj.data;
    getMovieDetails(id);
    resultBox.innerHTML = '';
})

// this is just to put a border to input box upon clicking it
inputObj.addEventListener('click',function(){
    document.querySelector('.input-box').style.borderWidth = '2px';
})




// the is the function to display the selected movie details in a div, taking imdbID as parameter
function getMovieDetails(tempId){
    movieId = tempId;
    var movieSearch = fetch(`https://www.omdbapi.com/?apikey=5013a07&i=${tempId}`).then(response => response.json().then(function(result){
    movieDetails = result;
    movieTitle = result.Title;
    moviePlot = result.Plot;
    moviePoster = result.Poster;
    posterImage.innerHTML = `<img src='${moviePoster}' alt='Image was not found'>`;
    let flag = false; // to check if the current movie is already a favorite one

        if (sessionStorage.getItem(movieId)) {
            flag = true;
        }
    
    details.innerHTML  = `<div style="display:flex;justify-content:space-evenly"> <span>${movieTitle}</span><span id='fav' class="material-symbols-outlined">favorite</span></div> <div> ${moviePlot}</div>`
    const favs = document.querySelector('#fav');
    currV = window.getComputedStyle(favs);
    if(flag){
        //if the movie is already marked as favorite, then chaning the icon to filled heart.
        favs.style = "font-variation-settings : 'FILL' 1;"  
    }
    // this is check if the user wants to add/remove the movie to favorite list.
    favs.addEventListener('click',function(){
        // if not favorite already
        if(currV.fontVariationSettings == 'normal' || currV.fontVariationSettings == `"FILL" 0`){
        favs.style = "font-variation-settings : 'FILL' 1;"
        window.sessionStorage.setItem(tempId,movieTitle);
        }// in case of removing it from favorite
        else{
        favs.style = "font-variation-settings : 'FILL' 0;" 
        window.sessionStorage.removeItem(movieId);
        }
        updateFavList();
    })
   
}));
  
}   