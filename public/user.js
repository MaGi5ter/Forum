start()
async function start() {
    overview_load()
}

async function overview_load() {

    document.getElementById("overview").innerHTML = ''

    // let user = user;
    let posts = await fetchdata(`/api/activity?user=${user}`)
    let comments = await fetchdata(`/api/usercomments?user=${user}`)

    let data = []

    for (let index = 0; index < posts[0].length; index++) {
        const element = posts[0][index];
        data.push(element)
    }

    for (let index = 0; index < comments.length; index++) {
        const element = comments[index];
        data.push(element)
    }

    data = await data.sort((a,b) => { return a.createdAt - b.createdAt })
    data.reverse()
    console.log(data)

    if(data.length == 0) {
        let node = document.createElement("div");
        node.id = 'post'

        node.innerHTML = `
            <h2>THIS USER NEVER POSTED ANYTHING</h2>
        `
        document.getElementById("overview").appendChild(node);
        return
    }

    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        let node = document.createElement("div");
        node.id = 'post'

        if(element.postTitle) {
            await load_comment(element)
        }
        else {
            await load_post(element)
        }
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

async function posts_load(){
    document.getElementById("overview").innerHTML = ''

    let posts = await fetchdata(`/api/activity?user=${user}`)

    console.log(posts)

    if(posts.length == 0) {
        let node = document.createElement("div");
        node.id = 'post'

        node.innerHTML = `
            <h2>THIS USER NEVER POSTED ANYTHING</h2>
        `
        document.getElementById("overview").appendChild(node);
        return
    }

    for (let index = 0; index < posts[0].length; index++) {
        let element = posts[0][index];
        console.log('awd')
        await load_post(element)

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

async function user_comments() {
    let comments = await fetchdata(`/api/usercomments?user=${user}`)

    document.getElementById("overview").innerHTML = ''

    if(comments.length == 0) {
        let node = document.createElement("div");
        node.id = 'post'

        node.innerHTML = `
            <h2>THIS USER NEVER COMMENTED ANYTHING</h2>
        `
        document.getElementById("overview").appendChild(node);
        return
    }

    for (let index = 0; index < comments.length; index++) {
        const element = comments[index];

        await load_comment(element)
    }

}


async function load_post(element) {
    element.content = JSON.parse(element.content)

        console.log(element)
        let node = document.createElement("div");
        node.id = 'post'
        

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
            ` 
        
        let content = `<div  id="makeit" onclick="redirect('/post/${element.id}')">`
        for (let index = 0; index < element.content.length; index++) {
            const e = element.content[index];

            console.log(e)

            if(e.type == 'title') {
                content = 
                ` ${content}

                <div id="title">
                    <h2>${e.content}</h2>
                </div>

                
                <div id="author">
                    <a href="/user/${element.author}" id="author_link">${element.author}</a>
                </div>

                `
            }
            else if(e.type == 'text') {
                // console.log(e)

                content = 
                ` ${content}<div id="post_content"><span class="${text_check(e)}">${e.content}</span></div>
                `
            }
            else if(e.type == 'image') {
                content = 
                ` ${content}

                <div id="image" class="${image_check(e)}"  >
                    <img id="dropped_image" class="${image_check(e)}" src='${e.image}'></img>
                </div>
                `
            }
            
        }

        function text_check(e) {
            if( e.spoiler == true) {
                return 'spoiler'
            }
            else if(e.nsfw == true ) {
                return 'nsfw'
            }
            else return 'visible'
        }

        function image_check(e) {
            if( e.spoiler == true) {
                return 'blur'
            }
            else if(e.nsfw == true ) {
                return 'blur'
            }
            else return 'visible'
        }

        content = `${content}</div>`

        node.innerHTML = `${node.innerHTML}${content}`

        document.getElementById("overview").appendChild(node);
}

async function load_comment(element) {
    let node = document.createElement("div");
        node.id = 'comment'

        node.innerHTML = `
            <p>commented <b><a id="basic_a" href="/post/${element.postId}">${element.postTitle}</a></b> posted by  <a id="basic_a" href="/user/${element.author}" >${element.author}</a></p>
            <div id="comment_content"><span>${element.content}</span></div>
        `
        document.getElementById("overview").appendChild(node);
        console.log(element)
}

function fetchdata(url) {
    return new Promise((resolve,reject) => {
    fetch(url, {
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
        else if (response.final == "vote_deleted" ){
            document.getElementsByClassName(`${post_id}_votes`)[0].innerHTML = response.current
            let downvote = document.getElementsByClassName(`${post_id}_down`)[0]
            console.log(downvote)
            downvote.classList.value = `${post_id}_down downvote_white downvote_white1`
            let upvote = document.getElementsByClassName(`${post_id}_up`)[0]
            upvote.classList.value = `${post_id}_up upvote_white upvote_white1`
        }
    })
}

function redirect(link) {
    location.replace(link)
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