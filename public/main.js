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
        let element = posts[0][index];

        element.content = JSON.parse(element.content)

        // console.log(element)
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

            // console.log(e)

            if(e.type == 'title') {
                content = 
                ` ${content}

                <div id='post_navbar'>
                <div id="author">
                        <span>Uploaded by </span><a href="/user/${element.author}" id="author_link">${element.author}</a>
                    </div>
                    <div id="title">
                        <h2>${e.content}</h2>
                    </div>
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

        // console.log(content)

        node.innerHTML = `${node.innerHTML}${content}`

        // console.log(node.querySelector('#makeit').style.height)

        // if(node.querySelector('#makeit').scrollHeight > node.style.height) {
        //     console.log(node)
        // }

        document.getElementById("posts").appendChild(node);
        const images = node.getElementsByTagName('img');
        const height = node.getBoundingClientRect().height;

        // console.log(images.length)

        if(images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                images[i].addEventListener('load', function() {
                  const height = node.getBoundingClientRect().height;
                  console.log(height)
              
                  if (height > 600) {
                    const button = document.createElement('button');
                    button.textContent = 'View Full Post';
                    button.id = 'show_full_button'
                    button.addEventListener('click', () => {
                        redirect(`/post/${element.id}`)
                        // do something when the button is clicked
                      });
              
                    node.appendChild(button);
                    i = images.length
                    // console.log(node)
                  }
                });
            }
        }
        else {
            if(height > 600) {
                const button = document.createElement('button');
                button.textContent = 'View Full Post';
                button.id = 'show_full_button'
                button.addEventListener('click', () => {
                    redirect(`/post/${element.id}`)
                    // do something when the button is clicked
                  });

                node.appendChild(button);
                // console.log(node)
            }
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

    // const posts_check = document.querySelectorAll('#post');
    // const posts_check = document.querySelectorAll('[id^="post"]');

    // posts_check.forEach((post) => {

    //     // let check =post.getElementById('makeit')
    //     // console.log(post.scrollHeight)

    // if (post.scrollHeight > 600) {
    //     console.log(post)

    //     const button = document.createElement('button');
    //     button.textContent = 'View Full';

    //     button.style.position = 'relative';
    //     button.style.bottom = '80%';
    //     button.style.left = '50%';
    //     button.style.transform = 'translateX(-50%)';

    //     post.appendChild(button);
    // }
    // });

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

    fetch(`/api/posts?before=${before}&type=p`, {
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

document.querySelector('div').addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() === 'a') {
      event.stopPropagation();
    }
  });