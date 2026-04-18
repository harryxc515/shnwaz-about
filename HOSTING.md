# Hosting and DNS Setup

This repository is configured to deploy to GitHub Pages with a custom domain `shnwaz.in`.

## GitHub Pages deployment

- Build command: `npm run build`
- Publish directory: `dist`
- The workflow is defined in `.github/workflows/deploy-pages.yml`
- The custom domain is configured in `public/CNAME`

## Required DNS records for `shnwaz.in`

Add these records in your domain registrar DNS settings:

- `A @ 185.199.108.153`
- `A @ 185.199.109.153`
- `A @ 185.199.110.153`
- `A @ 185.199.111.153`

## Notes

- DNS must be managed through your domain registrar; this repo cannot change DNS for you.
- You still need to add the DNS records at your registrar before the site will resolve.
- Once the DNS records are active and GitHub Pages deployment succeeds, the site should be available at `https://shnwaz.in`.
