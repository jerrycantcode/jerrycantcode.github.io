/* Todo with this piece of crap...

-Make change in css based on sidebar

*/

var testData = [`{
    "title": "This is a test",
    "date": "April 10th, 2024",
    "body": "<div class='sideBar'><div class='sideBarArticle'>are you sigma chat</div></div><div class='article'><p>Now, on my past websites I've liked to brag about how I'm one of the few people at my school who know how to program. While this may be true, my coding skills aren't as amazing as I may make them seem. I have a very good understanding of HTML and CSS, but ultimately those languages can really only produce static webpages. I've only just in this past year started to build up the skillset of using Javascript and APIs which I used to build this website. Every time I make a website similar to this, it's usually a pretty good representation of my skills at the time. It's actually really cool for me to visit my past websites and to just marvel at how far I've come. My former blog Onedev, which you'll learn a little more about if you keep reading, bragged about having flowing CSS transitions, a light and dark mode, and a pretty well navigable UI. It was basically the pinnacle of my skills back then, and I was dang well proud of it. Looking back, it wasn't much to brag about, and I'm sure i'll someday feel the same about this website as well. I decided to be a bit more humble with this website (if you couldn't already tell by the name) because I know that in a year's time, this probably will be no more than a relic of the past, cemented in my endless history of abandoned, dusty old projects from the years and years I've been coding. Because at the end of the day, no one website will ever be able to encapsulate my journey.</p></div>"}`,`{
        "title": "Im boutta cut off the stream chat",
        "date": "April 10th, 2024",
        "body": "<div class='article'><p>What do you mean my pronouns are OB/CD? Mods, ban this guy. And blow up his house. Everyone wanna phuck chuckamacka icka wanna fingasingabinganiga when i wanna se the poop oin my ass cuz it smells lol.</p></div>"}`]
var testProjData = [`{
    "title": "Test Project",
    "date":"April 25th, 2024",
    "body":"<div class='sideBar'><div class='sideBarArticle'><h3>Download + Links</h3><button class='dlButton'><img class='dlIcon' src='assets/download-white.png'></img>Download!</button><p>(.html)</p><p>Works on all modern browsers</p></div></div><div class='article'><iframe src='index.html'></iframe>"}`]

var postData = [];
var projectData = [];

const header = document.getElementById("header");
const content = document.getElementById("cont");
const logo = document.getElementById("logo");
const logo2 = document.getElementById("logo2");
const inputElement = document.getElementById('searchInput');
var focus = false;

inputElement.addEventListener('click', function() {
    focus = true; 
});

inputElement.addEventListener('blur', function() {
    focus = false;
});

document.addEventListener("keydown", function(e){
    if(e.key === "Enter") {
        if(focus) {
            search(inputElement.value)
        }
    }
})

function updateNavbarSize() {
    if (window.scrollY > 0) {
        document.getElementById("searchbarParent").classList.add('minimized')
        header.classList.add('minimized');
        logo.style.opacity = '0'
        logo2.style.opacity = '1'
        content.classList.add('minimized')
    } else {
        document.getElementById("searchbarParent").classList.remove('minimized')
        header.classList.remove('minimized');
        logo.style.opacity = '1'
        logo2.style.opacity = '0'
        content.classList.remove('minimized') 
    }
}

window.addEventListener('scroll', updateNavbarSize);

window.addEventListener('scroll', function() {
    document.getElementById("bg").style.scale = 1 + (window.scrollY / 2000)
})

updateNavbarSize();

function nav(id){
    let currentUrl = window.location.href;

    let newUrl = currentUrl.split('?')[0];

    window.history.pushState({ path: newUrl }, '', newUrl);
    window.location.href = '#' + id;
    for(let i = 0; i < document.getElementsByClassName("container").length; i++) {
        if(document.getElementsByClassName("container")[i].classList.contains('onload')) {
            document.getElementsByClassName("container")[i].classList.remove('onload');
            document.getElementsByClassName("container")[i].classList.add('leave');
        }
    }
    document.getElementById(`${id}Body`).classList.remove('leave');
    document.getElementById(`${id}Body`).classList.add('onload');

    if((id != 'search') && (id != 'post')) {
        sendAnalytics(id);
    }
}

function openPost(t,type) {
    nav('post')

    let currentUrl = window.location.href;
    let newUrl = currentUrl + `?post=${type + t}`;
    
    window.history.pushState({ path: newUrl }, '', newUrl);
    var pp;

    if(type==='blog') {
        pp = JSON.parse(postData[t])
    } else {
        pp = JSON.parse(projectData[t])
    }

    document.getElementById("postBody").innerHTML = `
    <div class="post">
        <div class="postInfo">
        <h1>`+pp.title+`</h1>
            <p class="date">Posted on `+pp.date+`</p>
        </div>
        <div class="post-content">
        `+pp.body+`
        </div>
    </div>
    `

    const parentElement = document.querySelector('#postBody');
    const childElement = parentElement.querySelector('.sideBar');

    if (!childElement) {
        parentElement.querySelector('.article').style.width = "100%"
    }

    sendAnalytics('post');
}

function countWords(html) {
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Get the text content from the temporary element
    const text = tempDiv.innerText || tempDiv.textContent;

    // Trim the text and split it into words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);

    // Return the total word count
    return words.length;
}

function postPreview(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.innerHTML = tempDiv.getElementsByClassName('article')[0].innerHTML

    const paragraphs = tempDiv.getElementsByTagName('p');

    var string = '';

    for (let p of paragraphs) {
        const text = p.innerText || p.textContent;
        string += text.replace(/\s+/g, ' ').trim();
    }

    return string.substring(0, 130);
}


function initData() {
    fetch('https://script.google.com/macros/s/AKfycbwgAhOcLoOm7JnWpUutKZgqdied2S96IE4bbbI2HsXLUFOypi5S36lQ9V_l5rMwYBqh/exec')
    .then(res => res.json())
    .then(data => {
        postData = data.columnA;
        projectData = data.columnB;
        bgData = data.columnC;

        document.getElementById("BlogPosts").innerHTML = ``
        for(let i = postData.length - 1; i >= 0; i--) {
            document.getElementById("BlogPosts").innerHTML += generatePostPreview('blog', JSON.parse(postData[i]), i) 
        }

        document.getElementById("ProjectPosts").innerHTML = ``
        for(let i = projectData.length - 1; i >= 0; i--) {
            document.getElementById("ProjectPosts").innerHTML += generatePostPreview('projects', JSON.parse(projectData[i]), i) 
        }

        BGINIT();
        load();
    })
    .catch(error => {
        postData = testData;
        projectData = testProjData;

        document.getElementById("BlogPosts").innerHTML = ``
        for(let i = postData.length - 1; i >= 0; i--) {
            document.getElementById("BlogPosts").innerHTML += generatePostPreview('blog', postData[i], i) 
        }
        document.getElementById("ProjectPosts").innerHTML = ``
        for(let i = projectData.length - 1; i >= 0; i--) {
            document.getElementById("ProjectPosts").innerHTML += generatePostPreview('projects', projectData[i], i);
        }
        
        load();

    })
}

function BGINIT() {
    let rand1 = Math.floor(Math.random() * bgData.length);
    let rand2 = Math.floor(Math.random() * bgData.length);
    while(rand2 === rand1) {
        rand2 = Math.floor(Math.random() * bgData.length);
    }

    document.getElementById('bgimg1').src = bgData[rand1]
    document.getElementById('bgimg2').src = bgData[rand2]
    setInterval(changeBG, 10000);
}

function changeBG() {
    let rand = Math.floor(Math.random() * bgData.length);
    while(rand === document.getElementById('bgimg2').src) {
        rand = Math.floor(Math.random() * bgData.length);
    } 
    document.getElementById('bgimg1').style.transition = '1s'
    document.getElementById('bgimg1').style.opacity = '0'
    setTimeout(function(){
        document.getElementById('bgimg1').src = document.getElementById('bgimg2').src;
        document.getElementById('bgimg2').src = bgData[Math.floor(Math.random() * bgData.length)]
        document.getElementById('bgimg1').style.transition = '0s'
        document.getElementById('bgimg1').style.opacity = '1'
    }, 500)
}

function search(input){
    let output = document.getElementById("SearchPosts");
    output.innerHTML = ``
    for(let i = postData.length - 1; i >= 0; i--) {
        let opt = JSON.parse(postData[i])
        if(JSON.stringify(opt).toLowerCase().includes(input.toLowerCase())) {
            output.innerHTML += generatePostPreview('blog', opt, i) 
        }
    }
    for(let i = projectData.length-1; i >= 0; i--) {
        let opt = JSON.parse(projectData[i])
        if(JSON.stringify(opt).toLowerCase().includes(input.toLowerCase())) {
            output.innerHTML += generatePostPreview('projects', opt, i) 
        }
    }
    if(output.innerHTML === ``) {
        output.innerHTML = `<h2>Uh oh... there were no results for that query.</h2>`
    }
    nav('search')

    let currentUrl = window.location.href;

    // Add parameters to the URL
    let newUrl = currentUrl + '?search='+input+'';
    
    // Push the new URL to the browser history
    window.history.pushState({ path: newUrl }, '', newUrl);

    sendAnalytics('search');
}

function generatePostPreview(type, data, i) {
    return `<div class="postPreview" onclick="openPost('${i}','${type}')"><div class="previewLeft"><h1>`+data.title+`</h1>
        <p>Posted on ${data.date}</p><p>${countWords(data.body)} words</p></div><div class="postPreviewParagraph">${postPreview(data.body)}...</div></div>`
}

function getURLParameters() {
    let currentUrl = window.location.href;

    let urlHash = window.location.hash.substring(1);
    let searchParam;
    let searchValue;
    let postParam;
    let postValue;
    
    if(currentUrl.split('?search')[1]) {
        searchParam = true;
        searchValue = currentUrl.split('=')[1]
    }
    
    if(currentUrl.split('?post')[1]) {
        postParam = true;
        postValue = currentUrl.split('=')[1]
    }

    return {
        urlHash: urlHash,
        hasSearchParam: searchParam,
        searchParamValue: decodeURIComponent(searchValue),
        hasPostParam: postParam,
        postParamValue: decodeURIComponent(postValue)
    };
}

var parameters;

function load() {
    let currentUrl = window.location.href;

    if(window.location.hash) {
        parameters = getURLParameters();
        window.location.href = window.location.href.split("?")[0] + `#` + parameters.urlHash + window.location.href.split("?")[1];
        if(parameters.hasSearchParam) {
            searchInput.value = parameters.searchParamValue;
            search(parameters.searchParamValue)
        } else if(parameters.hasPostParam) {
            nav("post")
            if(parameters.postParamValue.includes('blog')){
                openPost(parameters.postParamValue.split('blog')[1], 'blog')
            } else if(parameters.postParamValue.includes('projects')){
                openPost(parameters.postParamValue.split('projects')[1], 'projects')
            }
        }else {
            nav(parameters.urlHash)
        }
    } else {
        nav('home');
    }

    setTimeout(function(){
        window.dispatchEvent(new Event('resize'));
    },100);

    document.getElementById("overlay").style.display = `none`
};

initData();

document.getElementById("overlay").style.display = `flex`
document.getElementById("BlogPosts").innerHTML = `<h2>Loading Posts...</h2>`
document.getElementById("ProjectPosts").innerHTML = `<h2>Loading Posts...</h2>`