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
        `+pp.body+`
    </div>
    `
    sendAnalytics(pp, type);

    const parentElement = document.querySelector('#postBody');
    const childElement = parentElement.querySelector('.sideBar');

    if (!childElement) {
        parentElement.querySelector('.article').style.width = "100%"
    }

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

    fetch('https://script.google.com/macros/s/AKfycbwuhE9ocPBrDPqiQ-eBUug3F1GUWxStrr7hawxaV3FBYIvwi7AmeMVnNvvVZELQzfZr/exec')
    .then(res => res.json())
    .then(data => {
        postData = data.columnA;
        projectData = data.columnB;

        document.getElementById("BlogPosts").innerHTML = ``
        for(let i = postData.length - 1; i >= 0; i--) {
            document.getElementById("BlogPosts").innerHTML += `
            <div class="postPreview" onclick="openPost('${i}','blog')"><div class="previewLeft"><h1>`+JSON.parse(postData[i]).title+`</h1>
            <p>Posted on ${JSON.parse(postData[i]).date}</p><p>${countWords(JSON.parse(postData[i]).body)} words</p></div><div class="postPreviewParagraph">${postPreview(JSON.parse(postData[i]).body)}...</div></div>`
        }

        document.getElementById("ProjectPosts").innerHTML = ``
        for(let i = projectData.length - 1; i >= 0; i--) {
            document.getElementById("ProjectPosts").innerHTML += `
            <div class="postPreview" onclick="openPost('${i}','projects')"><div class="previewLeft"><h1>`+JSON.parse(projectData[i]).title+`</h1>
            <p>Posted on ${JSON.parse(projectData[i]).date}</p><p>${countWords(JSON.parse(projectData[i]).body)} words</p></div><div class="postPreviewParagraph">${postPreview(JSON.parse(projectData[i]).body)}...</div></div>`
        }

        load();
    })
    .catch(error => {
        postData = testData;
        projectData = testProjData;

        document.getElementById("BlogPosts").innerHTML = ``
        for(let i = postData.length - 1; i >= 0; i--) {
            document.getElementById("BlogPosts").innerHTML += `
            <div class="postPreview" onclick="openPost('${i}','blog')"><h1>`+JSON.parse(postData[i]).title+`</h1>
            <p>Posted on ${JSON.parse(postData[i]).date}</p></div>`
        }
        document.getElementById("ProjectPosts").innerHTML = ``
        for(let i = projectData.length - 1; i >= 0; i--) {
            document.getElementById("ProjectPosts").innerHTML += `
            <div class="postPreview" onclick="openPost('${i}','projects')"><h1>`+JSON.parse(projectData[i]).title+`</h1>
            <p>Posted on ${JSON.parse(projectData[i]).date}</p></div>`
        }
        
        load();

    })
}

function search(input){
    let output = document.getElementById("SearchPosts");
    output.innerHTML = ``
    for(let i = postData.length - 1; i >= 0; i--) {
        let opt = JSON.parse(postData[i])
        if(JSON.stringify(opt).toLowerCase().includes(input.toLowerCase())) {
            output.innerHTML += `<div class="postPreview" onclick="openPost('${i}','blog')"><h1>`+opt.title+`</h1>
            <p>Posted on `+opt.date+`</p></div>`
        }
    }
    for(let i = projectData.length-1; i >= 0; i--) {
        let opt = JSON.parse(projectData[i])
        if(JSON.stringify(opt).toLowerCase().includes(input.toLowerCase())) {
            output.innerHTML += `<div class="postPreview" onclick="openPost('${i}','projects')"><h1>`+opt.title+`</h1>
            <p>Posted on `+opt.date+`</p></div>`
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
}

function LoadVFX() {
    const scss_to_compile = `
    #snow {
        position: fixed;
        bottom: 0;
        overflow: hidden;
        height: 100vh;
        width: 99vw;
    }

    @function random_range($min, $max) {
        $rand: random();
        $random_range: $min + floor($rand * (($max - $min) + 1));
        @return $random_range;
      }
      
      .snow {
        $total: 1000;
        position: absolute;
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
      
        @for $i from 1 through $total {
          $random-x: random_range(0, 100vw);
          $random-offset: random_range(-10, 10);
          $random-x-end: $random-x + $random-offset;
          $random-x-end-yoyo: $random-x + ($random-offset / 2);
          $random-yoyo-time: random_range(30, 80) / 95;
          $random-yoyo-y: $random-yoyo-time * 100vh;
          $random-scale: random(10000) * 0.0001;
          $fall-duration: random_range(10, 30) * 1s;
          $fall-delay: random(30) * -1s;
      
          &:nth-child(#{$i}) {
            opacity: random(10000) * 0.0001;
            transform: translate($random-x, -10px) scale($random-scale);
            animation: fall-#{$i} $fall-duration $fall-delay linear infinite;
          }
      
          @keyframes fall-#{$i} {
            #{percentage($random-yoyo-time)} {
              transform: translate($random-x-end, $random-yoyo-y) scale($random-scale);
            }
      
            to {
              transform: translate($random-x-end-yoyo, 100vh) scale($random-scale);
            }
          }
        }
      }
      
      
    `;

Sass.compile(scss_to_compile, (result) => {
    var s = document.createElement("style");
    s.innerHTML = result.text;
    document.body.append(s);
});


   for (let i = 0; i < 200; i++) {
        document.getElementById("snow").innerHTML += `<div class="snow"></div>`
   }

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
    document.getElementById("overlay").style.display = `none`

    LoadVFX()
};

window.onload = function(){
    initData();
}

document.getElementById("overlay").style.display = `flex`
document.getElementById("BlogPosts").innerHTML = `<h2>Loading Posts...</h2>`
document.getElementById("ProjectPosts").innerHTML = `<h2>Loading Posts...</h2>`