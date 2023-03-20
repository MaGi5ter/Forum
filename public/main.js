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

    for (let index = 0; index < posts.length; index++) {
        const element = posts[index];
        console.log(element)
        let node = document.createElement("div");
        node.id = 'post'

        node.innerHTML = `

            <div id="voting">

                <div id="upvotebox" onclick="vote(1,${element.id})">
                    <div id="upvote""></div>
                </div>

                <div id="countbox" class="${element.id}_votes" >${element.votes}</div>

                <div id="downvotebox" onclick="vote(-1,${element.id})">
                    <div id="downvote"></div>   
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
}

async function vote(up_or_down,post_id) {
    console.log(up_or_down)
    console.log(post_id)

    await postData('/api/vote',{
        vote : up_or_down,
        postID: post_id,
        type: 'p'
    }).then((response) => {
        console.log(response)
        if(response == 'voted') {
            if(up_or_down == -1) {
                console.log(post_id)
                console.log(document.getElementsByClassName(`${post_id}_votes`)[0])
                
                let a = Number(document.getElementsByClassName(`${post_id}_votes`)[0].innerHTML)

                document.getElementsByClassName(`${post_id}_votes`)[0].innerHTML = a -1
            }
            else {
                console.log(post_id)
                console.log(document.getElementsByClassName(`${post_id}_votes`)[0])
                
                let a = Number(document.getElementsByClassName(`${post_id}_votes`)[0].innerHTML)

                document.getElementsByClassName(`${post_id}_votes`)[0].innerHTML = a + 1
            }
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