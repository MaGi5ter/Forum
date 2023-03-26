function unmark_spoiler(e) {
    let element = e.parentNode.parentNode
    element.querySelector('#orange').remove()

    e.setAttribute('onclick', 'mark_spoiler(this)');
    e.innerHTML = 'Mark As Spoiler'
}

function mark_spoiler(e) {
    console.log(e.parentNode.parentNode)

    let element = e.parentNode.parentNode
   
    let spoiler = document.createElement('div')
    spoiler.id = 'orange'
    spoiler.innerHTML = 'Spoiler'

    element.querySelector('#navbar_of_post_element').appendChild(spoiler)

    console.log(e)

    e.setAttribute('onclick', 'unmark_spoiler(this)');
    e.innerHTML = 'Remove Spoiler Tag'

}

function unmark_nsfw(e) {
    let element = e.parentNode.parentNode
    element.querySelector('#red').remove()

    e.setAttribute('onclick', 'mark_nsfw(this)');
    e.innerHTML = 'Mark As NSFW'
}

function mark_nsfw(e) {
    console.log(e.parentNode.parentNode)

    let element = e.parentNode.parentNode
   
    let nsfw = document.createElement('div')
    nsfw.id = 'red'
    nsfw.innerHTML = 'NSFW'

    element.querySelector('#navbar_of_post_element').appendChild(nsfw)

    console.log(e)

    e.setAttribute('onclick', 'unmark_nsfw(this)');
    e.innerHTML = 'Remove NSFW Tag'

}

function addimage() {

    let image = document.createElement('div')
    image.id = 'image'

    let navbar_of_post_element = document.createElement('div')
    navbar_of_post_element.id = 'navbar_of_post_element'

    image.appendChild(navbar_of_post_element)

    let dropzone = document.createElement('div')
    dropzone.id = 'dropzone'
    dropzone.innerHTML = 'Drop image or click here to select'

    image.appendChild(dropzone)

    let file_input = document.createElement('input')
    file_input.id = 'file-input'
    file_input.type = 'file'
    file_input.style = "display: none;"

    image.appendChild(file_input)

    let display_dropped = document.createElement('div')
    display_dropped.id = 'display_dropped'

    image.appendChild(display_dropped)

    let footer_of_post_element = document.createElement('div')
    footer_of_post_element.id = 'footer_of_post_element'
    footer_of_post_element.innerHTML = `
        <div id="button_" onclick="delete_(this)">Delete</div>
        <div id="button_" onclick="mark_spoiler(this)">Mark As Spoiler</div>
        <div id="button_" onclick="mark_nsfw(this)">Mark As NSFW</div>
    `

    image.appendChild(footer_of_post_element)

    document.getElementById('post_content').appendChild(image)


    const fileInput = file_input

    // Prevent the default dragover behavior to allow dropping
    dropzone.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    // Handle the dropped image
    dropzone.addEventListener('drop', (event) => {
        event.preventDefault();
        const imageFile = event.dataTransfer.files[0];
        handleImage(imageFile);
    });

    // Show file input when dropzone is clicked
    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle file input change
    fileInput.addEventListener('change', (event) => {
    const imageFile = event.target.files[0];
    // Get the file type
    // const fileType = file.type;
  
    // Check if the file is an image
    if (imageFile.type.startsWith('image/')) {
        // Upload the file
        console.log('Uploading image:', imageFile);
        handleImage(imageFile);
    } else {
        // Display an error message
        console.error('Error: Invalid file type. Only image files are allowed.');
    }
      

    });

    // Handle the selected image file
    function handleImage(imageFile) {
        const imageUrl = URL.createObjectURL(imageFile);

        let imageElement = document.createElement('img');
        imageElement.id = 'dropped_image'
        imageElement.src = imageUrl;

        dropzone.innerHTML = ''
        dropzone.style.display ="none"

        let image_display_zone = display_dropped
        image_display_zone.appendChild(imageElement);
    }

}

function delete_(e) {
    e.parentNode.parentNode.remove()
}

function addtext() {

    let element = document.createElement('div')
    let content = document.getElementById('post_content')

    element.id = 'text_element'

    element.innerHTML = `
        <div id="navbar_of_post_element"></div>

        <textarea placeholder="Write here" id="text_area" rows="1"></textarea>  

        <div id="footer_of_post_element">
            <div id="button_" onclick="delete_(this)">Delete</div>
            <div id="button_" onclick="mark_spoiler(this)">Mark As Spoiler</div>
            <div id="button_" onclick="mark_nsfw(this)">Mark As NSFW</div>
        </div>  
    
    `
    content.appendChild(element)

}

let title_area = document.getElementById('title_area')

title_area.addEventListener('input', (event) => {
    title_area.style.height ='auto'
    title_area.style.height = `${title_area.scrollHeight - 25}px`;
}, false);

async function upload() {
    let post_data = []

    const parent = document.getElementById('post_content');
    const childDivs = Array.from(parent.childNodes)
        .filter(node => node.nodeName === 'DIV');

    for (let index = 0; index < childDivs.length; index++) {
        const element = childDivs[index];
        
        console.log(element)

        if(element.id == 'title_element') {
            let title = element.querySelector('#title_area')

            console.log(title.value)

            title = {
                type:'title',
                content:title.value
            }

            post_data.push(title)

        }
        else if(element.id == 'text_element') {
            let content = {
                type: 'text',
                spoiler: false,
                nsfw: false,
                content:''
            }

            let text_content = element.querySelector('#text_area')
            text_content = text_content.value

            content.content = text_content

            if(element.querySelector('#red')) {
                content.nsfw = true
            }
            if(element.querySelector('#orange')) {
                content.spoiler = true
            }

            console.log(content)

            post_data.push(content)

        }
        else if(element.id == 'image') {
            let content = {
                type: 'image',
                spoiler: false,
                nsfw: false,
                image: undefined
            }

            if(element.querySelector('#red')) {
                content.nsfw = true
            }
            if(element.querySelector('#orange')) {
                content.spoiler = true
            }

            let img = element.querySelector('img')
            let img_src = img.src   


            const maxSize = 8343552; // 7.95 MB in bytes

            function isBlobTooBig(blob) {
                return blob.size > maxSize;
            }

            let img_blob = await getImageBlob(img_src)

            if(isBlobTooBig(img_blob)) {
                document.getElementById('submit_errors').innerHTML = 'img too big'
                return
            }

            console.log(img_blob)

            content.image =  await blobToDataURL(img_blob)

            post_data.push(content)
        }
    }

    console.log(post_data)
    document.getElementById('submit_errors').innerHTML = ''
    let try_ = await postData('/api/post',post_data)

    if(try_ == 'redirect') {
        location.href = '/';
    }

    try_ = JSON.parse(try_)

    if(try_.error) {
        document.getElementById('submit_errors').innerHTML = try_.error
    }
}

function getImageBlob(imageSrc) {
    return new Promise((resolve, reject) => {
        fetch(imageSrc)
        .then(response => response.blob())
        .then(blob => {
            const imageBlob = new Blob([blob], { type: blob.type });
            resolve(imageBlob);
        })
        .catch(error => reject(error));
    });
}  

function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
        resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
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