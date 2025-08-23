# Deployment Guide

This guide covers deploying NexusAI to various platforms.

## Vercel (Recommended)

### Prerequisites
- GitHub account with your NexusAI repository
- Vercel account
- Supabase project set up

### Steps

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Environment Variables**
   Add these in your Vercel project settings:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   GOOGLE_AI_API_KEY=your_google_ai_key
   \`\`\`

4. **Database Setup**
   - Run the SQL scripts in your Supabase dashboard:
     - `scripts/001_create_user_tables.sql`
     - `scripts/002_profile_trigger.sql`

5. **Domain Configuration**
   - Add your custom domain in Vercel settings
   - Update Supabase auth settings with your production URL

## Other Platforms

### Docker Deployment
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Railway
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

### Netlify
1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Verify AI provider integrations
- [ ] Check database connections
- [ ] Test chat functionality
- [ ] Verify email confirmations work
- [ ] Test settings page and API key management
- [ ] Check responsive design on mobile
- [ ] Verify dark/light theme switching
- [ ] Test error boundaries and 404 pages

## Monitoring

### Vercel Analytics
Enable Vercel Analytics in your project settings for:
- Page views and performance metrics
- User engagement tracking
- Error monitoring

### Supabase Monitoring
Monitor your database usage:
- Active connections
- Query performance
- Storage usage
- Auth metrics

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure variables are set in Vercel dashboard
   - Redeploy after adding new variables

2. **Supabase Connection Issues**
   - Verify URL and keys are correct
   - Check RLS policies are properly configured

3. **AI Provider Errors**
   - Verify API keys are valid and have sufficient credits
   - Check rate limits and quotas

4. **Build Failures**
   - Check TypeScript errors
   - Verify all dependencies are installed
   - Review build logs for specific errors

### Support
- Check GitHub Issues for known problems
- Join our Discord community for help
- Email support@nexusai.dev for critical issues
