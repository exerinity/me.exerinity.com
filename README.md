# me.exerinity.com
A basic biography-style page, with a hacker-like theme

# Why?
exerinity.com is too cluttered and feels more like a platform than a personal page.

# Setup
1. Download or copy the repo, however you do it. Not much changes.
2. Open `/i/stuff.js` and change:
- the DID in `const bsky` to your own
- `683100147512770602` in `const res` to your own Discord user ID
3. Open `/i/fillables` and edit the files to your liking. You can also add more, but make sure to add it in `/i/stuff.js` and on `index.html`, in buttons.
4. Start a server however you do and visit it. Personally, I like to do a simple `py -m http.server 80`.

# Credits
- [twemoji](https://twemoji.twitter.com/) for the emojis
- [Twitter](https://opensource.twitter.dev/) for the font, Chirp (Twitter Open Source is linked because it is not yet X-fied by X Corp)
- [Font Awesome](https://fontawesome.com/) for the icons    
- [pigeon.exerinity.com](https://pigeon.exerinity.com/) for the theme (reusing my own code lol)
- [Lanyard](https://lanyard.rest) for the Discord status

# License
See [LICENSE](LICENSE).