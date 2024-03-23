# active-search

To run this:

1. Enter `bun install` to install dependencies.
1. Enter `bun dev` to start the server.
1. Browse localhost:3000.

If modifying styling using Tailwind classes,
enter `bunx tailwindcss -i ./global.css -o public/tailwind.css --watch`.
This will regenerate the file `public/tailwind.css` every time a file is saved
so that it contains only the Tailwind classes actually used.
