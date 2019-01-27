$(document).ready(function() {

    let buttonArea = $("#button-holder");
    let gifArea = $("#gif-body");
    let submitButton = $("#submitButton");
    let textBox = $("#user-text");

    let muppetCharacterArr = [ "Grover", "Big Bird", "Kermit", "Miss Piggy", "Stadtler & Waldorf", "Elmo", "Rizzo the Rat", "Fozzie" ];

    muppetCharacterArr.forEach((val) => buttonBuilder(val));

    submitButton.on("click", function(event) {
        event.preventDefault();
        let newCharacter = textBox.val().trim();
        if(!muppetCharacterArr.includes(newCharacter)) {
            muppetCharacterArr.push(textBox.val().trim());
            buttonBuilder(muppetCharacterArr[muppetCharacterArr.length -1]);
        }
    });

    async function buttonBuilder(userString) {
        
        let query = "https://api.giphy.com/v1/gifs/search?q=" + encodeURI(userString) + "&api_key=dc6zaTOxFJmzC&limit=10";
        console.log(await getGiphyResponse(query));
        let giphyResponseObject = await getGiphyResponse(query);
        
        let newButton = $("<button>").text(userString).addClass("btn ml-1 mr-1 mt-2");

        newButton.on("click", function(event) {
            for(i = 0; i < giphyResponseObject.length; i++) {
                placeNewCard(giphyResponseObject[i]);
            }
        });

        buttonArea.append(newButton);
    }

    function getGiphyResponse(giphyURL) {
        return new Promise(function(resolve) {

            $.ajax({
                url: giphyURL,
                method: 'GET',
            }).then(function(response) {
                resolve(response.data);
            });
        });
    }

    function placeNewCard(gifObj) {
        let newCard = $("<div>").addClass("card w-25 d-inline-block m-2");

        let cardTitle = $("<h6>").addClass("card-header").text(gifObj.title);

        let cardTop = $("<img>").addClass("card-img").attr("width", "100px");
        cardTop.data("state", "still");
        cardTop.attr("src", gifObj.images.original_still.url);

        cardTop.on("click", function(event) {
            if(cardTop.data("state") === "still") {
                cardTop.attr("src", gifObj.images.original.url);
                cardTop.data("state", "animate");
            }
            else if(cardTop.data("state") === "animate") {
                cardTop.attr("src", gifObj.images.original_still.url);
                cardTop.data("state", "still");
            }
        });

        let cardRating = $("<div>").addClass("card-body").text(gifObj.rating);

        newCard.append(cardTitle).append(cardTop).append(cardRating);
        gifArea.prepend(newCard);
    }

});