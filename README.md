# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e31d3b4a-d019-4e4e-9b38-192eb7ac9435

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e31d3b4a-d019-4e4e-9b38-192eb7ac9435) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Vercel Web Analytics

## Vercel Web Analytics Setup

This project includes Vercel Web Analytics for tracking visitor behavior and page performance.

### Prerequisites

- A Vercel account ([sign up for free](https://vercel.com/signup))
- A Vercel project ([create a new project](https://vercel.com/new))
- The Vercel CLI installed: `npm install -g vercel`

### Enable Web Analytics

1. On the [Vercel dashboard](https://vercel.com/dashboard), select your Project
2. Click the **Analytics** tab
3. Click **Enable** from the dialog
4. Note: Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment

### Integration

The `@vercel/analytics` package has already been added to this project. The `Analytics` component from `@vercel/analytics/react` is integrated into the main `App.tsx` component, providing automatic page view tracking and performance monitoring.

The integration includes:
- Automatic page view tracking via React Router integration
- Web Vitals collection (LCP, FID, CLS, etc.)
- No additional configuration required

### Deploy Your App

Deploy your app to Vercel using:

```bash
vercel deploy
```

Or, connect your Git repository to Vercel for automatic deployments:

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository on [Vercel](https://vercel.com/new)
3. Your app will automatically deploy on every push to main

### View Your Data

Once your app is deployed and users have visited your site:

1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click the **Analytics** tab

**💡 Note:** If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from `/_vercel/insights/view` when you visit any page.

### Custom Events

Users on Pro and Enterprise plans can track custom user interactions such as button clicks, form submissions, or purchases. Learn more about [custom events](https://vercel.com/docs/analytics/custom-events).

### Learn More

For more information about Vercel Web Analytics, visit:
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [@vercel/analytics Package](https://vercel.com/docs/analytics/package)
- [Privacy and Compliance](https://vercel.com/docs/analytics/privacy-policy)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e31d3b4a-d019-4e4e-9b38-192eb7ac9435) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
