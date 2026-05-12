# Publish to `solution/lab-03-jotai`

```bash
git checkout lab-03-baseline
git checkout -b solution/lab-03-jotai

( cd social-media-rr-v7 && npm install jotai@^2 )

git rm social-media-rr-v7/app/context/AppContext.jsx
rmdir social-media-rr-v7/app/context 2>/dev/null || true

mkdir -p social-media-rr-v7/app/atoms
cp solutions/lab-03-jotai/app/atoms/drafts.js  social-media-rr-v7/app/atoms/drafts.js
cp solutions/lab-03-jotai/app/atoms/ui.js      social-media-rr-v7/app/atoms/ui.js
cp solutions/lab-03-jotai/app/atoms/user.js    social-media-rr-v7/app/atoms/user.js

cp solutions/lab-03-jotai/app/components/Header.jsx        social-media-rr-v7/app/components/Header.jsx
cp solutions/lab-03-jotai/app/components/Sidebar.jsx       social-media-rr-v7/app/components/Sidebar.jsx
cp solutions/lab-03-jotai/app/components/PostsFeed.jsx     social-media-rr-v7/app/components/PostsFeed.jsx
cp solutions/lab-03-jotai/app/components/PostActions.jsx   social-media-rr-v7/app/components/PostActions.jsx
cp solutions/lab-03-jotai/app/components/PostComposer.jsx  social-media-rr-v7/app/components/PostComposer.jsx
cp solutions/lab-03-jotai/app/routes/home.jsx              social-media-rr-v7/app/routes/home.jsx

cp solutions/lab-03-jotai/lab03-justification.md           social-media-rr-v7/lab03-justification.md

git add -A
git commit -m "Lab 3 solution (Jotai): replace bloated AppContext with atom graph"
# git push -u origin solution/lab-03-jotai
git checkout main
```
