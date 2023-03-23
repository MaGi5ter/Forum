start()
async function start() {

    if(user_name != ``) {
        let node = document.createElement("a");
        node.href = `/user/${user_name}`
        node.innerHTML = 'PROFILE'
        node.id = 'a_button_right'
        document.getElementById("profile").appendChild(node);
    }

    comments()

}

async function comments(){
    await fetchdata(`/api/comments?post=${post_id}`).then(async (repli) => {
        
        if(repli[0].length > 0) {
            for (let index = 1; index < repli[0].length; index++) {
                const element = repli[0][index];

                let node = document.createElement("div");

                node.innerHTML = `
                    <div id="nav_com">
                    <div id="voting">
                        <div id="upvotebox" onclick="vote(1,'${element.id}','c')">
                            <div id="upvote" class="${element.id}_comm_up upvote_white upvote_white1"></div>
                        </div>
                        <div id="countbox" class="${element.id}_comm_votes" >${element.votes}</div>
                        <div id="downvotebox" onclick="vote(-1,'${element.id}','c')">
                            <div id="downvote" class="${element.id}_comm_down downvote_white downvote_white1" ></div>   
                        </div>
                    </div>
                    <div id="conte">
                        <h3><a id="author_link" href="/user/${element.author}">${element.author}</a></h3>
                    </div>
                    <div id="replybutton" onclick="reply_textarea(${element.id})"><p>reply</p></div>
                </div>
                <div id="conte">
                <p>${element.content}</p>
                </div>
                <div id="${element.id}"></div>
                <div id="${element.id}_replies" class="replie"></div>
                `

                if(element.replyID == null) {
                    node.id = 'comment'
                    await document.getElementById("comments").appendChild(node);
                }
                else {
                    document.getElementById(`${element.replyID}_replies`).appendChild(node)
                }
            }

            //AFTER LOADING COMMENTS - LOAD USER VOTES  

            if(repli[1].length > 0) {
                console.log(repli[1].length)
        
                for (let index = 0; index < repli[1].length; index++) {
                    const element = repli[1][index];
                    
                    if(element.up_down == -1 ) {
                        let upvote = document.getElementsByClassName(`${element.post}_comm_down`)[0]
                        upvote.classList.value = `${element.post}_comm_down downvote_orangered downvote_orangered1`
                        // console.log(upvote.classList)
                    } else {
                        let upvote = document.getElementsByClassName(`${element.post}_comm_up`)[0]
                        upvote.classList.value = `${element.post}_comm_up upvote_orangered upvote_orangered1`
                        // console.log(upvote.classList)
                    }
                }
            }
        }
        else {
            return
        }
    })
}


async function reply_textarea(id) {

    if(user_name != "") {
        document.getElementById(id).innerHTML = `
    
        <div id="${id}form">
        <textarea id="reply_content" class="${id}_reply"></textarea>
        <div id="justflex"> 
            <p id="submitreply" onclick="uploadreply(${id})">REPLY</p>
            <p id="closetextare" onclick="closearea(${id})">X</p>
        </div>
        </div>
    
    `
    } else {
        document.getElementById('ifloggedaddcomment').innerHTML = `
            <h2>You need to be logged to comment</h2>
        `
        setTimeout(() => {
            document.getElementById('ifloggedaddcomment').innerHTML = ""
        }, 4000);
    }

}

async function vote(up_or_down,post_id,type) {
    console.log(up_or_down)
    console.log(post_id)

    await postData('/api/vote',{
        vote : up_or_down,
        postID: post_id,
        type: type
    }).then((response) => {

        response = JSON.parse(response)

        console.log(response)

        if(response.final == "voted" && type == 'p') {

            if(up_or_down == -1) {
                let downvote = document.getElementsByClassName(`${post_id}title_down`)[0]
                console.log(downvote)
                downvote.classList.value = `${post_id}title_down downvote_orangered downvote_orangered1`
                let upvote = document.getElementsByClassName(`${post_id}title_up`)[0]
                upvote.classList.value = `${post_id}title_up upvote_white upvote_white1`
            }
            else if (up_or_down == 1) {
                let upvote = document.getElementsByClassName(`${post_id}title_up`)[0]
                upvote.classList.value = `${post_id}title_up upvote_orangered upvote_orangered1`

                let downvote = document.getElementsByClassName(`${post_id}title_down`)[0]
                downvote.classList.value = `${post_id}title_down downvote_white downvote_white1`
            }

            document.getElementsByClassName(`${post_id}_votes`)[0].innerHTML = response.current
            
        }
        else if (response.final == "vote_deleted"  && type == 'p'){
            document.getElementsByClassName(`${post_id}_votes`)[0].innerHTML = response.current

            let downvote = document.getElementsByClassName(`${post_id}title_down`)[0]
            downvote.classList.value = `${post_id}title_down downvote_white downvote_white1`

            let upvote = document.getElementsByClassName(`${post_id}title_up`)[0]
            upvote.classList.value = `${post_id}title_up upvote_white upvote_white1`
        }
        else if (response.final == "voted" && type == 'c') {


            if(up_or_down == -1) {
                let downvote = document.getElementsByClassName(`${post_id}_comm_down`)[0]
                downvote.classList.value = `${post_id}_comm_down downvote_orangered downvote_orangered1`

                let upvote = document.getElementsByClassName(`${post_id}_comm_up`)[0]
                upvote.classList.value = `${post_id}_comm_up upvote_white upvote_white1`
            }
            else if (up_or_down == 1) {
                let upvote = document.getElementsByClassName(`${post_id}_comm_up`)[0]
                upvote.classList.value = `${post_id}_comm_up upvote_orangered upvote_orangered1`

                let downvote = document.getElementsByClassName(`${post_id}_comm_down`)[0]
                downvote.classList.value = `${post_id}_comm_down downvote_white downvote_white1`
            }

            document.getElementsByClassName(`${post_id}_comm_votes`)[0].innerHTML = response.current

        }
        else if (response.final == "vote_deleted"  && type == 'c'){
            document.getElementsByClassName(`${post_id}_comm_votes`)[0].innerHTML = response.current

            let downvote = document.getElementsByClassName(`${post_id}_comm_down`)[0]
            downvote.classList.value = `${post_id}_comm_down downvote_white downvote_white1`

            let upvote = document.getElementsByClassName(`${post_id}_comm_up`)[0]
            upvote.classList.value = `${post_id}_comm_up upvote_white upvote_white1`
        }
    })
}



async function closearea(id) {
    document.getElementById(id).innerHTML = ''
}

async function uploadreply(id){
    let data = document.getElementsByClassName(`${id}_reply`)[0].value

    await postData('/api/comment',{
        content : data,
        postID: post_id,
        reply: id,
    }).then((response) => {
        if(response == 'COMMENT ADDED') {
            document.getElementById('comments').innerHTML = ''
            loadcomments()
        }
    })
}

async function uploadcomment() {
    let data = document.getElementById('comment_content').value
    await postData('/api/comment',{
        content : data,
        postID: post_id,
        reply: null,
    }).then((response) => {
        if(response == 'COMMENT ADDED') {
            document.getElementById('comments').innerHTML = ''
            loadcomments()
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