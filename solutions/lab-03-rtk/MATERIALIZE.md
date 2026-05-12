# Publish to `solution/lab-03-rtk`

```bash
git checkout lab-03-baseline
git checkout -b solution/lab-03-rtk

( cd social-media-rr-v7 && npm install @reduxjs/toolkit react-redux )

git rm social-media-rr-v7/app/context/AppContext.jsx
rmdir social-media-rr-v7/app/context 2>/dev/null || true

mkdir -p social-media-rr-v7/app/store
cp solutions/lab-03-rtk/app/store/index.js         social-media-rr-v7/app/store/index.js
cp solutions/lab-03-rtk/app/store/draftsSlice.js   social-media-rr-v7/app/store/draftsSlice.js
cp solutions/lab-03-rtk/app/store/uiSlice.js       social-media-rr-v7/app/store/uiSlice.js
cp solutions/lab-03-rtk/app/store/userSlice.js     social-media-rr-v7/app/store/userSlice.js

cp solutions/lab-03-rtk/app/components/StoreProvider.jsx   social-media-rr-v7/app/components/StoreProvider.jsx
cp solutions/lab-03-rtk/app/components/Header.jsx          social-media-rr-v7/app/components/Header.jsx
cp solutions/lab-03-rtk/app/components/Sidebar.jsx         social-media-rr-v7/app/components/Sidebar.jsx
cp solutions/lab-03-rtk/app/components/PostsFeed.jsx       social-media-rr-v7/app/components/PostsFeed.jsx
cp solutions/lab-03-rtk/app/components/PostActions.jsx     social-media-rr-v7/app/components/PostActions.jsx
cp solutions/lab-03-rtk/app/components/PostComposer.jsx    social-media-rr-v7/app/components/PostComposer.jsx
cp solutions/lab-03-rtk/app/routes/home.jsx                social-media-rr-v7/app/routes/home.jsx

cp solutions/lab-03-rtk/lab03-justification.md             social-media-rr-v7/lab03-justification.md

git add -A
git commit -m "Lab 3 solution (RTK): replace bloated AppContext with createSlice + Provider"
# git push -u origin solution/lab-03-rtk
git checkout main
```
