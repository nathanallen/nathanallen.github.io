---
layout: post
title: "Octopress all over again"
date: 2014-08-09 22:19
comments: false
categories: 
---

Six months and a new laptop later, I decided it was time to pick things up where I left off with my blog.

Normally it's a simple as cloning a repo and you're on your way, but Octopress requires some additional setup.

If you're new to Octorpress you'll quickly discover it has a few quirks, among them: you work on one branch but deploy to another branch. Locally this means you actually have a project directory as one repo (your 'source' branch) and a sub-directory as another repo (your 'master' branch). Combine this with the fact that you'll be missing all the files in your .gitignore and you've got yourself in a Bad Situation (TM).

It took me three steps to get it right (thanks to [this post](http://blog.zerosharp.com/clone-your-octopress-to-blog-from-two-places/) for nudging me in the right direction).

**Step 0** - Don't forget to install ruby, ruby gems, rake, and make sure to bundle!

**Step 1** - Clone your 'source' branch:
``` bash
git clone -b source https://github.com/nathanallen/nathanallen.github.io
```

**Step 2** - Clone your 'master' repo into a subdiretory called `_deploy/`:
``` bash
cd nathanallen.github.io
git clone https://github.com/nathanallen/nathanallen.github.io _deploy
```

**Step 3** - Finally, generate your `public/` folder again (it's git-ignored so we need to recreate it):
``` bash
bundle exec rake generate
```

Friendly reminder: `rake -T` is your friend! Run it to see all the tasks available to you.

**Here's what you shouldn't do**:  
Don't run `rake setup_github_pages`. This will overwrite your `_deploy/` directory and master branch. Should you have done this, here's what you can do to recover your git commit history:
```
cd _deploy
git fetch --all
git reset --hard origin/master
```

You're all set to being using octopress!