/*
   Welcome to the script file for this... "biography". hardly even that, but whatever.

   This script does a few things. I'll do my best to explain them, but I don't usually comment my code. Oh well, I doubt anyone will read this anyway.
*/

// Twemoji is really cool so let's get that bitch going
twemoji.parse(document, { // say "document" for every emoji found on the page
    base: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/', // since maxcdn and all else fails use github
    size: '72x72',
    ext: '.png'
});

/* Now let's fetch my Bluesky posts
   This is fairly easy to modify to your own:
   go to this: https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=exerinity.com
   but replace my handle with your own, obviously. Then, in between "actor" and "filter", that gibberish, replace it with the result.

   Obvious question: why not do that here? Hardcoding is easier and I'm not hosting a damn tea party here.
*/
async function bluesky() {
    const bsky = 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=did%3Aplc%3A4ol7tajbdx5ugq2zblpmraf2&filter=posts_and_author_threads&includePins=false&limit=1';

    try {
        const res = await fetch(bsky);
        const json = await res.json();

        if (json.feed && json.feed.length > 0) {
            const post = json.feed.find(p => !p.reason) || json.feed[0].post;
            const text = post.post.record.text || null;
            const date = new Date(post.post.record.createdAt).toLocaleString(
                'en-US',
                {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                    // fix time up
                }
            );
            const img = post.post.embed && post.post.embed.images && post.post.embed.images[0]
                ? post.post.embed.images[0].fullsize
                : null; // check images

            document.getElementById('post-text').innerHTML = `<a href="https://bsky.app/profile/${post.post.author.did}/post/${post.post.uri.split('/').pop()}">${text}</a>`;
            document.getElementById('post-date').innerHTML = `${date} on <i class="fa-brands fa-bluesky" title="Bluesky"></i>:`;

            if (img) {
                const photo = document.getElementById('post-image');
                photo.src = img;
                photo.style.display = 'block';
                document.getElementById('post-link').href = `https://bsky.app/profile/${post.post.author.did}/post/${post.post.uri.split('/').pop()}`;

            }

            document.getElementById("spinz").remove();
        } else {
            document.getElementById("spinz").remove();
            document.getElementById('post-text').textContent = 'no posts found :('; // usually if i repost something, or whatnot
        }
    } catch (err) {
        // simple error handling
        document.getElementById('error').textContent = `Error: ${err.message}`;
        document.getElementById('error').style.display = 'block';
        document.getElementById('post-text').textContent = '';
    }
}

bluesky(); // gooo

/*
   Now let's fetch my Discord activity
   This uses Lanyard; a pretty cool API that exposes presences

   Yes, I'm well aware a websocket API exists. I use it at https://exerinity.com/now
   this isnt designed for real-time, its one of the few gimmicks of this nonsense.
*/
async function discord() {
    const res = await fetch('https://api.lanyard.rest/v1/users/683100147512770602');
    const json = await res.json();

    let status = 'online';
    if (json.data.discord_status === "offline") status = "offline";

    const display = `${status}`;
    const music = json.data.listening_to_spotify ? `♪` : '';

    document.querySelector('#status').innerHTML = '<i class="fa-brands fa-discord" title="Discord activity"></i> ' + display;

    document.getElementById("spinz2").remove();

    if (json.data.listening_to_spotify && json.data.spotify) {
        const song = `"${json.data.spotify.song}" by ${json.data.spotify.artist.replace(/;/g, ',')}`;
        const list = document.querySelector('#listening');
        list.innerHTML = `<i class="fa-brands fa-spotify" title="Now playing on Spotify"></i> listening to <a href="https://open.spotify.com/track/${json.data.spotify.track_id}" style="font-weight: normal; text-transform: none;"><strong>${song}</strong></a>`;
    } else if (json.data.activities.length > 0) {
        const game = json.data.activities[0].name;
        const gameText = `playing <strong>${game}</strong>`;
        document.querySelector('#listening').innerHTML = gameText;
    } else {
        document.querySelector('#listening').textContent = music;
    }
}
setInterval(discord, 10000);
discord();

// now my poor attempt at variable content
const sections = {
    socials: {
        file: '/i/fillables/socials.txt',
        postProcess: () => {
            twemoji.parse(document, {
                base: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/',
                size: '72x72',
                ext: '.png'
            });
        }
    },
    projects: {
        file: '/i/fillables/projects.txt'
    },
    contact: {
        file: '/i/fillables/contact.txt'
    },
    more: {
        file: '/i/fillables/more.txt'
    },
    songs: {
        file: '/i/fillables/songs.txt'
    },
    nothing: {
        file: '/i/fillables/nothing.txt' // no idea why I did it this way
    }
};

const fillables = {};

const fill = async (file) => {
    if (fillables[file]) {
        return fillables[file];
    }
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
        }
        const content = await response.text();
        fillables[file] = content;
        return content;
    } catch (error) {
        console.error(error);
        return `<p>Error</p>`;
    }
};

const switch_container = async (section) => {
    const misc = document.getElementById('misc');
    const changable = document.getElementById('changable');
    changable.innerHTML = '<div class="spinner" id="spinz3">';

    if (!misc || !changable) {
        console.error('Required DOM elements not found');
        return;
    }
    misc.innerHTML = section === 'nothing' ? 'view something:' : '<br>'; // this is probably the most interesting part
    const content = await fill(sections[section]?.file || '/i/fillables/nothing.txt');
    
    changable.innerHTML = content;

    if (sections[section]?.postProcess) {
        sections[section].postProcess();
    }
};

document.querySelector('.button-group').addEventListener('click', (event) => {
    const section = event.target.dataset.section;
    if (section) {
        switch_container(section);
    }
});

// lets get colourful
function colour() {
    const colours = [
        { main: '#ffffff', hover: '#e6e6e6', active: '#cccccc' }, // white
        { main: '#0000ff', hover: '#0000cc', active: '#000099' }, // blue
        { main: '#ffff00', hover: '#cccc00', active: '#999900' }, // yellow
        { main: '#00ff00', hover: '#00cc00', active: '#009900' }, // green
        { main: '#ff0000', hover: '#cc0000', active: '#990000' }, // red
        { main: '#ff7f50', hover: '#e6734d', active: '#cc6666' }, // coral
        { main: '#ffa500', hover: '#e68a00', active: '#cc8000' }, // orange
        { main: '#ffc0cb', hover: '#e6b3d1', active: '#cc99b3' }, // pink
        { main: '#00ffff', hover: '#00cccc', active: '#009999' }  // cyan
    ];

    if (!colour.lastIndex && colour.lastIndex !== 0) colour.lastIndex = -1;
    // the below is a very unconventional way to avoid duplicate selections and ensure a new colour is chosen each time
    let idx;
    do {
        idx = Math.floor(Math.random() * colours.length);
    } while (colours.length > 1 && idx === colour.lastIndex);
    colour.lastIndex = idx;
    const chosen = colours[idx];

    // everythinggggggggggggggg
    document.documentElement.style.setProperty('--main-color', chosen.main);
    document.documentElement.style.setProperty('--hover-color', chosen.hover);
    document.documentElement.style.setProperty('--active-color', chosen.active);
}

colour();

let bpm = null;

function rave() {
    if (bpm) {
        clearInterval(bpm);
        bpm = null;
        document.getElementById('rave').textContent = 'rave';
        // re-enable the new colour button, 'colour'
        document.getElementById('colour').disabled = false;
        document.getElementById('colour').style.opacity = '1';
    } else {
        const interval = Math.round(60000 / 128); // 128 bpm, the standard in big-room EDM, my favourite genre
        bpm = setInterval(colour, interval);
        document.getElementById('rave').textContent = 'stop rave';
        // disable the new colour button
        document.getElementById('colour').disabled = true;
        document.getElementById('colour').style.opacity = '0.5';
        document.getElementById('colour').style.cursor = 'not-allowed';
    }
}

// an entire popup mechanism for something nobody will probably see
function socials_ecom() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.3)';
    overlay.style.backdropFilter = 'blur(7px)';
    overlay.style.zIndex = 9999;
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    const box = document.createElement('div');
    box.style.background = 'black';
    box.style.color = 'white';
    box.style.borderRadius = '16px';
    box.style.boxShadow = '0 4px 32px rgba(0,0,0,0.18)';
    box.style.padding = '2rem 2.5rem 1.5rem 2.5rem';
    box.style.maxWidth = '420px';
    box.style.width = '90vw';
    box.style.position = 'relative';
    box.style.fontFamily = 'inherit';
    box.style.textAlign = 'center';

    const close = document.createElement('button');
    close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    close.setAttribute('aria-label', 'Close');
    close.style.position = 'absolute';
    close.style.top = '12px';
    close.style.right = '16px';
    close.style.background = 'none';
    close.style.border = 'none';
    close.style.fontSize = '1.3rem';
    close.style.cursor = 'pointer';
    close.style.color = 'var(--active-color, #000)';
    close.style.transition = 'color 0.2s';
    close.onmouseenter = () => close.style.color = 'var(--hover-color, #000)';
    close.onmouseleave = () => close.style.color = 'var(--active-color, #000)';
    close.onclick = () => document.body.removeChild(overlay);

    const msg = document.createElement('div');
    msg.style.marginTop = '0.5rem';
    msg.style.fontSize = '1.08rem';
    msg.style.lineHeight = '1.6';
    msg.innerHTML = `<h2>why are the links "exerinity.com"?</h2>The links begin with "exerinity.com" to make it more streamlined. These links use Cloudflare Pages' _redirect rules, so it's one central file.
<br><br>
For example, if I change handles, get banned, or simply leave, it's 1000x times easier to update, as opposed to going to 20 different sites and places and edit them one-by-one.
<br><br>
<button onclick="window.location.href='https://developers.cloudflare.com/pages/configuration/redirects/'">Learn more</button> <button onclick="document.body.removeChild(document.querySelector('body > div[style*=&quot;position: fixed&quot;]'));">Got it</button>`;

    box.appendChild(close);
    box.appendChild(msg);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', e => {
        if (e.target === overlay) document.body.removeChild(overlay);
    });
}

// swap font from Fira Code to Chirp
function font() {
    const thestuff = document.getElementById('main-content');

    const chirp = thestuff.classList.contains('chirp-font');

    if (chirp) {
        thestuff.classList.remove('chirp-font');
        thestuff.style.fontSize = '';
        document.getElementById('font').textContent = 'swap to Chirp font';
    } else {
        thestuff.classList.add('chirp-font');
        thestuff.style.fontSize = '1.1rem';
        document.getElementById('font').textContent = 'swap to Fira Code font';
    }
}

// and thats all, i hope you hated it