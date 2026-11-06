# Number System Made Easy — Complete Redesign Build

This package updates the existing Grade 9 DTI learning portal while preserving its lesson content, assessments, PowerPoint resources, and learning features. The visual direction follows the approved Bhutanese-inspired maroon, navy, ivory, and gold design.

## Included pages and features
- Home page with all ten lessons displayed in the corrected order.
- Learn page with a guided learning path, lesson status, and completion progress.
- Ten individual lesson pages retaining their original explanations, worked examples, five-question checks, and PowerPoint resources.
- Ten supplied YouTube video embeds, matched to lessons 1–10.
- Video completion tracking with saved viewing progress; the corresponding quiz unlocks after the video ends.
- Quiz pass requirement: at least 4/5 to complete a lesson and unlock the next.
- Practice Zone with conversion tool and worked steps.
- Offline Number System Tutor with topic explanations and suggested prompts.
- Student Dashboard with actual browser-stored lesson progress and earned badges.
- Five-stage Number Quest with upgraded game badges.
- Final 50-mark challenge, gated until all ten lessons and five game stages are complete.
- Existing certificate page, requiring at least 40/50 after prerequisites.
- About Us and Feedback pages.
- Font-size controls, persistent light/dark mode, responsive navigation.
- Original PowerPoint files and in-page PDF slide previews retained.

## Video configuration
`videos-config.js` contains the ten supplied video IDs and the official YouTube channel link. Do not change the order unless the corresponding lesson mapping is intentionally changed.

## Important technical notes
- Video progress, lesson results, game stages, badges, and final score are stored in browser `localStorage`. They are not synchronised between devices and are not secure teacher-verified records.
- The YouTube IFrame API is used to track playback. The player saves the latest watched position and attempts to prevent large forward seeks in the browser. This is a client-side learning safeguard, not tamper-proof examination security; a learner with developer tools can alter browser-side data.
- YouTube playback requires an internet connection and the video owner must allow embedding. If a video has embedding disabled or is unavailable, students can open it on YouTube.
- The Number System Tutor is an offline, rule-based collection of prepared explanations. It is not a live generative AI chatbot.
- Lesson 7's PDF slide preview is a text-based rendering because the original PPTX could not be converted by LibreOffice. The original editable Lesson 7 PowerPoint is included unchanged.
- No synthetic background music is included. The previously disliked synthetic tone remains removed.

## Local testing
1. Extract the ZIP.
2. Open the extracted folder in VS Code.
3. Use the Live Server extension and open `index.html`.
4. Test all ten lesson pages, videos, quiz locks, Practice Zone, Tutor, Number Quest, Final Challenge, certificate, and both themes.
5. Test in a normal browser window with internet access for YouTube playback.

Opening the HTML file directly with `file://` may restrict some browser features. Use a local web server such as VS Code Live Server.

## Publish to the existing GitHub Pages repository
1. Extract this ZIP.
2. Open the extracted folder and select all its contents (`index.html`, `lessons.html`, `style.css`, `script.js`, `videos-config.js`, all other HTML files, `assets`, and `resources`).
3. Upload/replace those contents in the root of your existing repository `DTI-Number-System-Made-Easy` (do not upload the ZIP file itself and do not nest everything inside another `Final` folder).
4. Commit the changes to the `main` branch.
5. Wait for GitHub Pages to rebuild, then open the existing website URL and hard-refresh it (`Ctrl + F5`).
6. If your website is embedded in Google Sites, refresh the embedded page after the GitHub Pages update.

## Existing project structure
- `index.html` — Home
- `lessons.html` — Learn directory
- `lesson1.html` … `lesson10.html` — Individual lessons
- `practice.html` — Practice Zone
- `tutor.html` — Number System Tutor
- `dashboard.html` — Student Dashboard
- `game.html` — Number Quest
- `challenge.html` — Final 50-mark challenge
- `certificate.html` — Certificate
- `about.html`, `feedback.html` — retained pages
- `style.css`, `script.js`, `videos-config.js` — shared styles and logic
- `assets/` — original Bhutanese design assets and team images
- `resources/` — original PowerPoints and PDF slide previews
