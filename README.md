# Number System Made Easy — Bhutanese Design

A static website for Grade 9 Digital Technology and Innovation. It uses HTML, CSS, and JavaScript and can be hosted on GitHub Pages or embedded in Google Sites using the published site URL.

## Pages
- `index.html` — home page
- `lessons.html` — all lessons
- `lesson1.html` through `lesson10.html` — lesson content, video player area, and five interactive practice questions each
- `challenge.html` — 50-mark final challenge (MCQ, short answers, fill-in-the-blanks, true/false, conversion problem)
- `certificate.html` — certificate unlocks when the latest final-challenge score is at least 40/50 (80%)
- `about.html` — team and project information
- `feedback.html` — feedback form

## Add your YouTube videos
1. Open `videos-config.js`.
2. For each lesson, replace the empty quotes with the 11-character video ID. For example, if the URL is `https://www.youtube.com/watch?v=AbCdEf12345`, the ID is `AbCdEf12345`.
3. Save and upload the file to GitHub. Lesson 10 can remain blank until that video is ready.

The channel link is included on each lesson page: https://www.youtube.com/@NumberSystemMadeEasier/videos

## Publish with GitHub Pages
Upload the contents of this folder to the repository root (keep the `assets` folder and all files together). In **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/(root)`, then Save. After deployment, open the Pages URL.

## Google Sites
In Google Sites, choose **Insert → Embed → By URL** and paste the published GitHub Pages URL. The published site remains hosted on GitHub Pages; Google Sites displays it in an embed. For best navigation and sizing, test the published site in the embed on desktop and mobile.

## Important limitations
- The certificate gate is client-side and uses the browser's local storage. It is appropriate for a practice learning artefact, but it is not tamper-proof or a secure exam system; students can clear or modify browser storage. A server-backed LMS is required for secure, verified certification.
- Short answers in the final challenge use keyword matching and may not award marks for equivalent wording. Teacher review is recommended.
- This package does not invent video IDs. Add the IDs from your channel to `videos-config.js`; leave Lesson 10 blank until ready.


## Updated authentic Bhutanese design
- The home and inner-page hero areas now use the supplied photographic Bhutanese dzong-and-river sunset image (`assets/bhutan-dzong-photo.jpg`).
- Decorative side rails use the supplied carved Bhutanese floral panel (`assets/bhutan-carved-border.jpg`).
- Existing layout, lesson content, color palette, typography, quiz panels, and page navigation have been retained.

## One video per lesson
Each lesson page reads only its matching numbered ID from `videos-config.js`: Lesson 1 uses ID 1, Lesson 2 uses ID 2, and so on. Add the 11-character YouTube video ID (not the whole URL) to the corresponding slot. Students see that lesson's embedded player on its lesson page, not a list of all channel videos. Leave Lesson 10 blank until its video is ready.
