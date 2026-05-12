# Materialize the Lab 3 baseline

This step is optional. It's only useful if you want a `lab-03-baseline`
reference branch in the repo so students can clone the "before" state
without manually constructing the bloat.

## Script

```bash
git checkout solution/lab-02-rr-v7
git checkout -b lab-03-baseline

mkdir -p social-media-rr-v7/app/context social-media-rr-v7/app/components

cp solutions/lab-03-baseline/app/context/AppContext.jsx       social-media-rr-v7/app/context/AppContext.jsx
cp solutions/lab-03-baseline/app/components/Header.jsx        social-media-rr-v7/app/components/Header.jsx
cp solutions/lab-03-baseline/app/components/Sidebar.jsx       social-media-rr-v7/app/components/Sidebar.jsx
cp solutions/lab-03-baseline/app/components/PostsFeed.jsx     social-media-rr-v7/app/components/PostsFeed.jsx
cp solutions/lab-03-baseline/app/components/PostActions.jsx   social-media-rr-v7/app/components/PostActions.jsx
cp solutions/lab-03-baseline/app/components/PostComposer.jsx  social-media-rr-v7/app/components/PostComposer.jsx
cp solutions/lab-03-baseline/app/routes/home.jsx              social-media-rr-v7/app/routes/home.jsx

git add -A
git commit -m "Lab 3 baseline: bloated AppContext + prop drilling for refactor practice"
# git push -u origin lab-03-baseline
git checkout main
```

The three solution branches each branch off `lab-03-baseline`, not off
`main`, so the diff a student sees lines up with what the lab asks them
to do.
