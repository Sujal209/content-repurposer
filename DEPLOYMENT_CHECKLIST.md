# 🚀 ContentCraft Deployment Checklist

## **CRITICAL - Must Complete Before Deployment**

### **1. Environment Configuration**
- [ ] **Update Production URL**: Change `NEXT_PUBLIC_APP_URL` in environment variables
- [ ] **Generate New Secrets**: Create new production values for:
  - `NEXTAUTH_SECRET` (use: `openssl rand -base64 32`)
  - `CSRF_SECRET` (use: `openssl rand -base64 32`)
- [ ] **Verify API Keys**: Ensure all API keys are valid and have sufficient credits

### **2. Database Setup**
- [ ] **Run Supabase Migration**: Execute `20250103000000_add_content_analysis_column.sql`
- [ ] **Configure RLS Policies**: Apply Row Level Security policies
- [ ] **Apply Rate Limiting**: Follow `SUPABASE_CONFIGURATION.md` settings
- [ ] **Test Database Connection**: Verify all tables and policies work

### **3. Code Cleanup**
- [ ] **Remove Debug Code**: Clean up console.logs and development-only code
- [ ] **Update Metadata**: Set correct domain in `layout.tsx` metadata
- [ ] **Verify Error Handling**: Ensure all API routes have proper error handling
- [ ] **Test All Features**: Verify content generation, auth, and history work

### **4. Assets & Media**
- [ ] **Replace Favicon**: Add proper favicon.ico file (currently placeholder)
- [ ] **Add Meta Images**: Create and add Open Graph images
- [ ] **Optimize Images**: Ensure all images are optimized for web

### **5. Performance & Security**
- [ ] **Run Build Test**: Execute `npm run build` and fix any errors
- [ ] **Security Headers**: Verify CSP and security headers in middleware
- [ ] **Rate Limiting**: Test API rate limiting works correctly
- [ ] **Bundle Analysis**: Check bundle size with `npm run build && npx @next/bundle-analyzer`

### **6. Platform-Specific Setup**

#### **Vercel Deployment**
- [ ] **Connect Repository**: Link GitHub repo to Vercel
- [ ] **Set Environment Variables**: Add all env vars to Vercel dashboard
- [ ] **Configure Domains**: Set up custom domain if needed
- [ ] **Test Deployment**: Deploy to preview first, then production

#### **Alternative Platforms**
- [ ] **Docker Setup**: Create Dockerfile if deploying to containers
- [ ] **Server Configuration**: Set up reverse proxy if using VPS
- [ ] **SSL Certificates**: Ensure HTTPS is properly configured

### **7. Post-Deployment Testing**
- [ ] **Authentication Flow**: Test signup, login, logout
- [ ] **Content Generation**: Test all three platforms (Twitter, LinkedIn, Instagram)
- [ ] **Database Operations**: Test content saving and history
- [ ] **Error Handling**: Test error scenarios and rate limiting
- [ ] **Mobile Responsiveness**: Test on various devices
- [ ] **Performance**: Check Core Web Vitals and loading times

### **8. Monitoring & Analytics**
- [ ] **Error Tracking**: Set up Sentry or similar (optional)
- [ ] **Analytics**: Add Google Analytics or Vercel Analytics (optional)
- [ ] **Uptime Monitoring**: Set up uptime monitoring (optional)
- [ ] **Usage Tracking**: Monitor API usage and costs

## **IMMEDIATE ACTION ITEMS**

### **High Priority (Must Fix)**
1. **Update Production Environment Variables**
2. **Run Database Migration**
3. **Replace Placeholder Favicon**
4. **Test Complete User Flow**

### **Medium Priority (Should Fix)**
1. **Add Proper Meta Images**
2. **Optimize Bundle Size**
3. **Set Up Error Monitoring**
4. **Configure Custom Domain**

### **Low Priority (Nice to Have)**
1. **Add Analytics**
2. **Set Up Monitoring**
3. **Create Docker Configuration**
4. **Add More Comprehensive Tests**

## **Environment Variables for Production**

```bash
# Update these for production deployment
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_SECRET=your-new-production-secret
CSRF_SECRET=your-new-csrf-secret

# Keep these as-is (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://obbcnukftvwvujingmrr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENROUTER_API_KEY=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
```

## **Quick Deployment Commands**

```bash
# 1. Final build test
npm run build

# 2. Check for any TypeScript errors
npm run lint

# 3. Test production build locally
npm run start

# 4. Deploy to Vercel (if using Vercel)
npx vercel --prod
```

## **Rollback Plan**

If deployment fails:
1. **Revert Environment Variables**: Restore previous working values
2. **Database Rollback**: Have backup of database state before migration
3. **Code Rollback**: Keep previous working commit hash ready
4. **DNS Rollback**: Keep old domain configuration ready

## **Success Criteria**

Deployment is successful when:
- [ ] All pages load without errors
- [ ] Authentication works end-to-end
- [ ] Content generation produces results
- [ ] Database operations complete successfully
- [ ] No console errors in production
- [ ] Performance metrics are acceptable
- [ ] Mobile experience is smooth

---

**⚠️ IMPORTANT**: Test everything in a staging environment before production deployment!