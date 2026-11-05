# Number System Made Easy — Reviewed Website Package

## Correct lesson sequence
1. Introduction to Number Systems
2. Binary to Octal
3. Binary to Decimal
4. Decimal to Binary
5. Binary and Hexadecimal
6. Decimal to Octal
7. Octal to Decimal
8. Decimal to Hexadecimal
9. Hexadecimal to Decimal
10. Octal and Hexadecimal

## Included
- Original Bhutan-inspired website styling and assets.
- About Us and Feedback pages retained and linked in navigation.
- Ten corrected lessons with matching original PowerPoint download files and embedded PDF slide previews (students can view slides on the lesson page or download the editable PPTX).
- Sequential lesson access: a learner must pass the previous lesson quiz (at least 4/5) before opening the next.
- Student dashboard with lesson scores, progress and badges.
- Practice Zone for common base conversions with worked steps.
- Offline Number System Tutor with guided topic explanations.
- Five-stage Number Quest game and five game badges.
- 50-mark final challenge, available after all ten lessons and all five game stages are completed.
- Certificate page, requiring 40/50 or higher plus the learning prerequisites.
- Font size increase, decrease and reset controls.
- Light/dark theme toggle with browser preference saving.
- Video placeholders; no YouTube IDs have been fabricated.

## PowerPoint viewing
Each lesson page now includes an embedded PDF slide viewer, an option to open the preview in a separate tab, and a separate download button for the original editable PPTX. The Lesson 7 PDF preview is a text-based slide rendering because the source PPTX could not be opened by LibreOffice during conversion; the original Lesson 7 PowerPoint download is preserved unchanged.

## Music
The unpleasant synthetic tone was removed. There is no background music player in this package because no suitable music track was provided. A proper audio track can be added later; the site will not play a random beep or autoplay sound.

## Feedback
The Feedback page is a working demo form that prepares a copyable feedback summary. It does not send submissions to a database or email. To collect feedback centrally, connect the form to Google Forms or a backend service.

## Run and publish
1. Extract the ZIP.
2. Open the `CAPS WEBSITE/Final` folder.
3. Open `index.html` locally, or use VS Code Live Server.
4. Upload the contents of `Final` to the root of your GitHub repository.
5. Enable GitHub Pages using branch `main` and folder `/ (root)`.
6. Replace the embedded site URL in Google Sites with the new GitHub Pages URL.

## Progress and certificate limitations
Progress, scores, badges and certificate eligibility are stored in browser local storage. This is appropriate for a classroom prototype but is not secure or teacher-verifiable. Clearing browser data or changing devices can reset or hide progress. A production system with student accounts, teacher reporting and verified certificates needs a backend/database.

## Validation performed for this package
- All inline JavaScript blocks and `script.js` passed Node syntax checks.
- All ten lesson quiz functions were exercised with their answer keys; each returned 5/5.
- Number Quest game logic was exercised through all five stages; all five stage rewards were issued.
- Practice Zone conversion logic was tested with 1011₂ → 11₁₀.
- Shared progress logic, badge counts, font preference handler and theme preference handler were tested with a JavaScript mock browser environment.
- Certificate unlock logic was tested for an eligible learner.
- The 50-mark assessment structure was checked: 20 one-mark choice items plus 30 marks of written/conversion items.
- Browser-based visual testing inside the actual Google Sites embed has not been performed. Test the published site in your own browser before sharing it with students.
