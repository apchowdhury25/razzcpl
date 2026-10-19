# Razz Construction and Properties

Marketing site for [razzcpl.com](https://razzcpl.com/). Static HTML, CSS, and a small PHP contact form, ready to upload to Hostinger. No build step.

The layout follows the same kind of property site as a full-bleed front page, a filterable project index, an about section, businesses, notes, and a landowner / client enquiry. The palette is darker: warm charcoal, stone type, olive, and brass. Photographs in `images/` were made for this site.

## Preview

From this folder:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. Binding to `127.0.0.1` keeps the preview on IPv4. The contact form needs PHP (`php -S 127.0.0.1:8765` if PHP is installed). On a plain Python server the form will not send mail.

## Deploy on Hostinger

Hostinger’s Node.js importer needs an application it can start. `server.js` serves the pages and accepts the contact form. `npm run build` also copies the site into `dist/` for a static upload.

### Git import

1. In hPanel, open the website → **Deployments** → **Deployment settings**.
2. Set:
   - Framework: **Express**
   - Branch: `main`
   - Node.js: **22**
   - Build command: `build`
   - Output directory: leave empty
   - Entry file: `server.js`
3. Save and redeploy. A push to `main` redeploys after this is saved.
4. Create the mailbox `hello@razzcpl.com` and turn on SSL. The form uses `sendmail` when the server provides it. If mail is not available, the contact page tells the visitor to write to that address.

### File Manager

You can also upload the contents of `dist/` (after `npm run build`) into `public_html`. `index.html` must sit in `public_html`, not inside an extra folder. Do not upload `.git`, `node_modules`, or the repository root as a nested folder.

## Replace before launch

These are samples so the template has a shape. They are not company records.

- Office address and phone, in the footer and on `contact.html`
- Founding years and the real sequence on `story.html`
- Names and short biographies on `team.html`
- The five projects (`project-*.html`, the cards on `index.html` and `projects.html`): real names, areas, land, floors, and handover
- The footer line that says project names are samples
- Business desks on `businesses.html`, if the company has other companies to list
- The three desk notes under News, if you would rather publish real announcements

Email used until you change it: `hello@razzcpl.com`.
