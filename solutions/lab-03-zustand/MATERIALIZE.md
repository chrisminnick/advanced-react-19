# Publish to `solution/lab-03-zustand`

```bash
git checkout lab-03-baseline
git checkout -b solution/lab-03-zustand

# Add zustand
( cd social-media-rr-v7 && npm install zustand@^5 )

# Drop the bloated context
git rm social-media-rr-v7/app/context/AppContext.jsx
rmdir social-media-rr-v7/app/context 2>/dev/null || true

# New stores
mkdir -p social-media-rr-v7/app/stores
cp solutions/lab-03-zustand/app/stores/drafts.js  social-media-rr-v7/app/stores/drafts.js
cp solutions/lab-03-zustand/app/stores/ui.js      social-media-rr-v7/app/stores/ui.js
cp solutions/lab-03-zustand/app/stores/user.js    social-media-rr-v7/app/stores/user.js

# Rewritten components + route
cp solutions/lab-03-zustand/app/components/Header.jsx        social-media-rr-v7/app/components/Header.jsx
cp solutions/lab-03-zustand/app/components/Sidebar.jsx       social-media-rr-v7/app/components/Sidebar.jsx
cp solutions/lab-03-zustand/app/components/PostsFeed.jsx     social-media-rr-v7/app/components/PostsFeed.jsx
cp solutions/lab-03-zustand/app/components/PostActions.jsx   social-media-rr-v7/app/components/PostActions.jsx
cp solutions/lab-03-zustand/app/components/PostComposer.jsx  social-media-rr-v7/app/components/PostComposer.jsx
cp solutions/lab-03-zustand/app/routes/home.jsx              social-media-rr-v7/app/routes/home.jsx

# Justification doc at the client root
cp solutions/lab-03-zustand/lab03-justification.md           social-media-rr-v7/lab03-justification.md

git add -A
git commit -m "Lab 3 solution (Zustand): replace bloated AppContext with per-feature stores"
# git push -u origin solution/lab-03-zustand
git checkout main
```
