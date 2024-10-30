[![Netlify Status](https://api.netlify.com/api/v1/badges/05e288a4-4c16-468a-b42d-5bb8c2cdf6fd/deploy-status)](https://app.netlify.com/sites/akshay-portfolio-v2/deploys)

---

# Personal Portfolio Website V2

Live on https://akshaygupta.live

## Technologies used
Created using following:

* React 18
* Next.js 14
* Typescript
* Sass
* Bootstrap 5
* [Resend](https://resend.com) to send mails
* [Sanity.io](https://www.sanity.io) for blog management (CMS)

## How to run locally

 * Create `.env.local` at the root of the project, this will contain -
    * `RESEND_API_KEY` for your Resend account
    * `NEXT_PUBLIC_SANITY_PROJECT_ID` from your Sanity project settings
    * `NEXT_PUBLIC_SANITY_DATASET` (usually "production")
    * `NEXT_PUBLIC_SANITY_HOOK_SECRET` generated from your Sanity project API settings
 * Above keys are used in `src/app/api/sendMail/route.ts` and Sanity client configuration.

Local server can be started by -
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can try out the older version of my site built with Gatsby [https://github.com/gupta-akshay/portfolio](here).

---

I hope you will like this project. Feel free to drop your feedback at [contact@akshaygupta.live](contact@akshaygupta.live) or [akshaygupta.live@gmail.com](akshaygupta.live@gmail.com).

❤️ Akshay Gupta
