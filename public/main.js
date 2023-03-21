start()
async function start() {

    if(user_name != ``) {
        let node = document.createElement("a");
        node.href = `/user/${user_name}`
        node.innerHTML = 'PROFILE'
        node.id = 'a_button_right'
        document.getElementById("profile").appendChild(node);
    }

    let now = Date.now()
    let posts = await fetchposts(now)

    for (let index = 0; index < posts[0].length; index++) {
        const element = posts[0][index];
        // console.log(element)
        let node = document.createElement("div");
        node.id = 'post'
        // orangered
        node.innerHTML = `

            <div id="voting">

                <div id="upvotebox" onclick="vote(1,${element.id})">
                    <div id="upvote" class="${element.id}_up upvote_white upvote_white1"></div>
                </div>

                <div id="countbox" class="${element.id}_votes" >${element.votes}</div>

                <div id="downvotebox" onclick="vote(-1,${element.id})">
                    <div id="downvote" class="${element.id}_down downvote_white downvote_white1" ></div>   
                </div>

            </div>

            <a href="/post/${element.id}"></a>

            <div>
                <a href="/post/${element.id}">
                    <h2 id="post_link">${element.title}</h2>
                </a>
                <a href="/user/${element.author}" id="author_link">${element.author}</a>
                <p>${element.content}</p>
            </div>
        `

        document.getElementById("posts").appendChild(node);

        // console.log(element)
    }

    if(posts[1].length > 0) {
        console.log(posts[1].length)

        for (let index = 0; index < posts[1].length; index++) {
            const element = posts[1][index];
            
            if(element.up_down == -1 ) {
                let upvote = document.getElementsByClassName(`${element.post}_down`)[0]
                upvote.classList.value = `${element.post}_down downvote_orangered downvote_orangered1`
                // console.log(upvote.classList)
            } else {
                let upvote = document.getElementsByClassName(`${element.post}_up`)[0]
                upvote.classList.value = `${element.post}_up upvote_orangered upvote_orangered1`
                // console.log(upvote.classList)
            }
        }
    }
}

async function vote(up_or_down,post_id) {
    console.log(up_or_down)
    console.log(post_id)

    await postData('/api/vote',{
        vote : up_or_down,
        postID: post_id,
        type: 'p'
    }).then((response) => {

        response = JSON.parse(response)

        if(response.final == "voted") {

            if(up_or_down == -1) {
                let downvote = document.getElementsByClassName(`${post_id}_down`)[0]
                downvote.classList.value = `${post_id}_down downvote_orangered downvote_orangered1`
                // console.log(downvote.classList)
                let upvote = document.getElementsByClassName(`${post_id}_up`)[0]
                upvote.classList.value = `${post_id}_up upvote_white upvote_white1`
            }
            else {
                let downvote = document.getElementsByClassName(`${post_id}_down`)[0]
                downvote.classList.value = `${post_id}_down downvote_white downvote_white1`
                // console.log(downvote.classList)
                let upvote = document.getElementsByClassName(`${post_id}_up`)[0]
                upvote.classList.value = `${post_id}_up upvote_orangered upvote_orangered1`
            }
    
            console.log(post_id)
            console.log(document.getElementsByClassName(`${post_id}_votes`)[0])

            document.getElementsByClassName(`${post_id}_votes`)[0].innerHTML = response.current
            
        }
    })
}

function postData(url = "",data = {}) {
return new Promise((resolve, reject) => {
    data = JSON.stringify(data)
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
        resolve(xhr.responseText)
    }};
    xhr.send(data);
})
}

function redirect(link) {
    location.replace(link)
}

function fetchposts(before) {
    return new Promise((resolve,reject) => {
        console.log(before)

    fetch(`/api/posts?before=${before}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    }).then(response => {
        return response.text();
        }).then(function(data) {
            resolve(JSON.parse(data)); 
        });
    })
}