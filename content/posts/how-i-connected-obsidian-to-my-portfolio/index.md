---
title: How I Connected Obsidian to My Portfolio (and Why Not Notion)
description: I write my blog posts in Obsidian and publish them to my Next.js portfolio with a git push. Here's why I chose that over Notion, and how the pieces fit together.
image: cover.png
date: 2026-11-08
category: Workflow
tags:
  - Obsidian
  - Next.js
  - Markdown
  - Vercel
draft: false
---

Before this post, I had published three posts on this site since early 2025. It wasn't for lack of ideas. Every post meant opening the repo in VS Code, writing Markdown in a code editor, saving screenshots into a separate `public/` folder, typing out image paths by hand, and committing. None of that is hard, but all of it is friction, and friction is what stops you writing.

So I changed how the blog works. I now write in [Obsidian](https://obsidian.md), paste screenshots straight into the post, and publish with a commit and push. The site itself didn't change. This post is about why I picked that setup, and how I wired it up.

## What I wanted

Before choosing a tool, I wrote down what I actually needed:

- **A pleasant editor.** Somewhere I enjoy writing, not a code editor.
- **Screenshots without ceremony.** Paste an image and have it just work, on the site too.
- **Publishing as a deliberate act.** Nothing half-finished going live by accident.
- **No new moving parts.** My site is a Next.js app on Vercel that builds Markdown at build time. I didn't want it depending on someone else's API at runtime.

## The options

I looked at three ways of doing it.

1. **Keep going as I was.** Markdown files in the repo, edited in VS Code. Free and simple, but it's the setup that produced three posts.
2. **Use Notion as a CMS.** Write in Notion, and have the site pull pages from the Notion API.
3. **Use Obsidian on top of the repo.** Point Obsidian at the folder my posts already live in, and publish with git.

Notion was the tempting one. It's a lovely editor, and it would let me publish from my phone. But when I looked closer, the costs added up:

- **Images expire.** Images in Notion pages come back from the API as signed URLs that stop working after about an hour. To use them on a website, the build has to download and re-host every image.
- **The API is rate-limited**, so a build that fetches many pages has to be careful.
- **Conversion loses things.** Notion's blocks don't map perfectly onto Markdown and HTML. Code blocks and headings in particular need care.
- **A runtime dependency.** The site would need a rebuild every time I changed something in Notion, triggered by a webhook or a timer. My content would also live somewhere I don't control.

The phone was the only real argument for Notion, and I write on my laptop. So I went with Obsidian.

## Why Obsidian fits

Obsidian's big idea is that your notes are just Markdown files in a folder. That happens to be exactly what my site already reads. There's no export step and no sync service: the files Obsidian edits *are* the files the site builds.

That gives me a good editor, offline writing, and image pasting, while my content stays as plain files in my own git repo, with full history.

## How it works

### 1. Open the content folder as a vault

My posts and projects live in a `content/` folder in the repo. I open **that folder** in Obsidian as a vault, not the whole repo. If you open the repo root, Obsidian also indexes `node_modules`, which makes it slow. As you'll see next, it also matters for images.

### 2. Keep images next to the post

This was the most important change. Obsidian can only preview images inside the vault, but a Next.js site serves static files from `public/`, which is outside it. If images lived in `public/`, they'd look broken while I was writing.

So each post is now a folder, with its images beside it:

```
content/
  posts/
    how-i-connected-obsidian-to-my-portfolio/
      index.md
      cover.png
      step-1.png
```

The folder name becomes the URL, and deleting a post deletes its images too.

The vault's settings live in `content/.obsidian/` and are committed to git, so every machine I write on behaves the same:

```json
{
  "attachmentFolderPath": "./",
  "useMarkdownLinks": true,
  "newLinkFormat": "relative"
}
```

- `attachmentFolderPath: "./"` saves pasted images in the same folder as the note.
- `useMarkdownLinks: true` makes Obsidian write standard `![](image.png)` links instead of its own `![[image.png]]` wiki links, which no Markdown pipeline understands.
- `newLinkFormat: "relative"` keeps those links relative to the post.

### 3. Copy the images at build time

The site still needs to serve those images. Before the content build runs, a small script copies every image from `content/` into `public/content-assets/`, which git ignores. While `next dev` is running, it watches the folder, so a screenshot I paste shows up on the local site straight away.

Then a remark plugin rewrites relative image links in each post into the URLs they're served from:

```js
export function resolveAssetUrl(url, documentDir) {
  // Absolute paths, full URLs and anchors are left alone
  if (!url || /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(url)) return url;

  const joined = posix.normalize(posix.join(documentDir, url));
  if (joined.startsWith("../")) {
    throw new Error(`"${url}" points outside the content folder`);
  }
  return `/content-assets/${joined}`;
}
```

So `![](step-1.png)` in this post becomes `/content-assets/posts/how-i-connected-obsidian-to-my-portfolio/step-1.png` on the site. The same function handles the cover image in the frontmatter.

### 4. Drafts

Writing in the same folder as published posts means unfinished work sits next to finished work. Every post has a `draft` flag in its frontmatter. When I run the site locally, drafts appear with a "Draft" badge so I can preview them. In production they're hidden everywhere: the blog list, the post page itself (it returns a 404), the sitemap, the RSS feed, search and the social preview images.

Production builds also skip compiling drafts, so a half-written post can't break a deploy.

### 5. Fail loudly

My posts are `.md` files, but the site compiles them with MDX. That means a stray `{` or `<` in normal text is a syntax error. The content library I use would log the error and quietly carry on building without the broken post, so a deploy could "succeed" with a post missing.

I didn't want to find that out from a reader. Now any content error fails the production build and names the file:

```
Content build failed with 1 error(s):
Failed to compile content/posts/my-post/index.md: Unexpected end of file in expression
```

### 6. Templates

Obsidian's built-in Templates plugin points at `content/_templates/`, which holds a post template with all the frontmatter filled in and `draft: true` set. The site's build ignores that folder.

### 7. Publish with Obsidian Git

The last piece is the [Obsidian Git](https://github.com/Vinzent03/obsidian-git) community plugin. When a post is ready, I set `draft: false`, run **Commit all changes** and then **Push** from Obsidian's command palette, and Vercel deploys it. I left the plugin's automatic commit-and-sync off. Publishing should be something I choose to do, not something that happens on a timer.

## My writing flow now

1. Create a folder in `posts/` named after the URL I want.
2. Create an `index` note in it and insert the post template.
3. Write, pasting screenshots as I go.
4. Preview it locally with `pnpm dev`.
5. Set `draft: false`, commit, push.

This post is the first one written that way.

## The trade-offs

No setup is free, so here's what I gave up:

- **No publishing from my phone.** Obsidian Git works poorly on iOS. For me that's fine.
- **MDX is strict.** I have to remember that `{` and `<` in normal text need escaping. The loud build failure makes that a minor annoyance rather than a silent bug.
- **"Commit all changes" means everything.** Obsidian Git commits every change in the repo, not just the post, so I commit code changes separately first.

If you have a Markdown-based blog in a git repo and you're not writing as often as you'd like, try opening your content folder in Obsidian. For me, the editor was never the hard part. Getting rid of the steps between writing and publishing was.
