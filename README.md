# bakar.info

The personal site of Muhammad Abu Bakar, software engineer: Posts about what I'm learning and the Projects I've built.

Live at [www.bakar.info](https://www.bakar.info).

## Stack

- [Next.js 15](https://nextjs.org/) (App Router) and TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)
- [Content Collections](https://www.content-collections.dev/) and [Fumadocs](https://fumadocs.dev/) for Markdown content
- [Resend](https://resend.com/) for the contact form
- Deployed on [Vercel](https://vercel.com/)

## Running locally

Requires Node.js 20 or later and [pnpm](https://pnpm.io/) 9 (the version is pinned in `package.json`).

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

Other scripts:

| Command | What it does |
| --- | --- |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm test` | Run the unit tests |
| `pnpm lint` | Lint |

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need:

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_BASE_URL` | The site's public URL, used for canonical links, the sitemap and feeds. Defaults to `https://www.bakar.info` in production. |
| `RESEND_API_KEY` | Sending contact form messages |
| `RESEND_FROM` | Sender address for contact form messages (optional) |
| `CONTACT_EMAIL` | Where contact form messages are delivered (optional) |

## Writing and publishing

Posts live in `content/posts/` and Projects in `content/projects/`. See `GLOSSARY.md` for what each term means.

Each one is a folder with an `index.md` and its images beside it:

```
content/
  posts/
    my-new-post/
      index.md
      cover.jpg
      step-1.png
  projects/
    my-project/
      index.md
      cover.png
```

The folder name is the URL: `content/posts/my-new-post/` is published at `/blog/post/my-new-post`.

### Set up Obsidian (once per machine)

1. In Obsidian, choose **Open folder as vault** and pick the `content/` folder (not the repo root).
   The vault settings are committed, so pasted images are saved next to the note, links are standard Markdown, and templates come from `content/_templates/`.
2. Install the **Obsidian Git** community plugin (Settings → Community plugins → Browse), and leave its automatic backup off.

### Write a Post

1. Create a folder in `posts/` named after the URL you want, for example `posts/my-new-post/`.
2. Inside it, create a note called `index` and run **Templates: Insert template** → `post`.
3. Fill in the frontmatter and write. Paste screenshots straight in.
4. Add a cover image to the folder and set `image:` to its file name.

Don't start the body with `# Title`: the page already shows the title as its heading (a `#` heading in the body is turned into `##`). If you substantially revise a published Post later, add `updated: "YYYY-MM-DD"` so search engines see the change.

New Posts start with `draft: true`. Drafts show up in `pnpm dev` with a Draft badge and are hidden everywhere on the live site.

### Add a Project

Same steps in `projects/`, using the `project` template. Leave the body empty for a card only. Write a body to give the Project a Case Study page at `/projects/<folder-name>`.

To say a Post is about a Project, add `project: <project-folder-name>` to the Post's frontmatter.

### Publish

1. Set `draft: false`.
2. In Obsidian, run **Obsidian Git: Commit all changes**, then **Obsidian Git: Push**.
3. Vercel deploys `main` automatically. If the content has an error (missing frontmatter, a stray `{` or `<` in the text), the deploy fails and the build log names the file.

### After publishing a Post

1. Wait for the Vercel deploy, open the Post, and check its Share Card (the preview shown when the link is shared) with the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
2. In [Google Search Console](https://search.google.com/search-console), paste the Post's URL into **URL Inspection** and click **Request indexing**.
3. On dev.to, open the draft the RSS import created (its canonical URL already points here), check it, and publish it.
4. For tutorials, Cross-post to [Hashnode](https://hashnode.com/): paste the Post and set its canonical URL to the Post on this site.
5. Share it on LinkedIn, X and relevant [daily.dev](https://daily.dev/) Squads, adding a source tag to each link so analytics show where readers came from:
   - `https://www.bakar.info/blog/post/my-new-post?utm_source=linkedin`
   - `?utm_source=x`
   - `?utm_source=dailydev`

daily.dev no longer accepts personal blogs as sources (since January 2024), so Squads are the way to share there.

## License

MIT. Originally built from [Next.js Portfolio App v2](https://github.com/timtbdev/Next.js-Portfolio-App-v2) by Tim.
