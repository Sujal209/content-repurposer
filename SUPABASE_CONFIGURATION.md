# 🔧 Supabase Dashboard Configuration for Rate Limit Optimization

This guide provides the specific Supabase dashboard settings you need to configure to optimize rate limiting and prevent 429 errors.

## 📊 **Rate Limiting Settings**

### 1. **Authentication Settings**
Navigate to: `Settings` → `Authentication` in your Supabase dashboard

**Rate Limit Configuration:**
```
Session refresh rate limit: 10 requests per minute
Password recovery rate limit: 5 requests per hour  
Magic link rate limit: 3 requests per hour
OAuth rate limit: 10 requests per minute
```

**JWT Settings:**
- **JWT expiry**: 1 hour (3600 seconds)
- **Refresh token expiry**: 24 hours (86400 seconds) 
- **JWT secret**: Keep your existing secret (do not change)

### 2. **API Rate Limiting**
Navigate to: `Settings` → `API`

**Global Rate Limits:**
```
Anonymous requests: 100 per minute
Authenticated requests: 200 per minute
Realtime connections: 20 per minute
```

### 3. **Database Connection Pooling**
Navigate to: `Settings` → `Database`

**Connection Pool Settings:**
```
Pool size: 15 connections
Pool timeout: 10 seconds
Max client connections: 3 per user
```

## 🔐 **Authentication Optimization**

### 4. **Session Configuration**
Navigate to: `Authentication` → `Settings` → `Sessions`

**Recommended Settings:**
```yaml
Session timeout: 7 days
Refresh token rotation: Enabled
Reuse interval: 10 seconds
Allow signups: true
Auto-confirm users: false (unless you want to skip email verification)
```

### 5. **Security Settings**
Navigate to: `Authentication` → `Settings` → `Security`

**Security Configuration:**
```yaml
Site URL: https://your-domain.com
Additional redirect URLs:
  - http://localhost:3000/dashboard
  - https://your-domain.com/dashboard
  - https://your-domain.com/auth

CAPTCHA protection: Disabled (for development)
Password strength: Strong
MFA enforcement: Optional
```

## 🌐 **Realtime Configuration**

### 6. **Realtime Settings**
Navigate to: `Settings` → `API` → `Realtime`

**Realtime Limits:**
```yaml
Max concurrent connections: 100
Max events per second: 100
Max channels per connection: 100
Message size limit: 256 KB
```

**For your project, consider these conservative settings:**
```yaml
Max concurrent connections: 50
Max events per second: 10
Max channels per connection: 5
```

## 🔧 **Project-Specific Settings**

### 7. **Environment Variables**
Add these to your Supabase project settings (`Settings` → `API`):

```bash
# Optional: Custom rate limiting
SUPABASE_RATE_LIMIT_ENABLED=true
SUPABASE_RATE_LIMIT_REQUESTS_PER_MINUTE=60

# JWT settings
JWT_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=86400
```

### 8. **Row Level Security (RLS) Policies**
Navigate to: `Authentication` → `Policies`

Make sure you have these policies enabled for your tables:

**For `content_history` table:**
```sql
-- Enable RLS
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to see their own content
CREATE POLICY "Users can view their own content" ON content_history
    FOR SELECT USING (auth.uid() = user_id);

-- Policy for authenticated users to insert their own content
CREATE POLICY "Users can insert their own content" ON content_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to delete their own content
CREATE POLICY "Users can delete their own content" ON content_history
    FOR DELETE USING (auth.uid() = user_id);
```

**For `generation_limits` table:**
```sql
-- Enable RLS
ALTER TABLE generation_limits ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage their own limits
CREATE POLICY "Users can manage their own limits" ON generation_limits
    FOR ALL USING (auth.uid() = user_id);
```

## 🚨 **Critical Configuration Changes**

### 9. **Immediate Actions Required**

1. **Reduce JWT Expiry Time:**
   - Go to `Settings` → `Authentication` → `JWT Settings`
   - Set `JWT expiry` to **1 hour** instead of the default 24 hours
   - This reduces token refresh frequency

2. **Enable Connection Pooling:**
   - Go to `Settings` → `Database` → `Connection Pool`
   - Set `Pool size` to **15**
   - Set `Pool timeout` to **10 seconds**

3. **Configure Session Management:**
   - Go to `Authentication` → `Settings`
   - Enable `Refresh token rotation`
   - Set `Reuse interval` to **10 seconds**

4. **Set Conservative Rate Limits:**
   ```
   Authentication requests: 10 per minute
   Anonymous API requests: 50 per minute  
   Authenticated API requests: 100 per minute
   ```

## 🔍 **Monitoring & Debugging**

### 10. **Usage Monitoring**
Navigate to: `Reports` → `API Usage`

Monitor these metrics:
- **Auth requests per minute**
- **Database connections**
- **Realtime connections**  
- **API requests by endpoint**

### 11. **Logs Configuration**
Navigate to: `Logs` → `Settings`

Enable these log types:
- **Auth logs** (for authentication debugging)
- **Database logs** (for query debugging)
- **API logs** (for rate limit monitoring)

## 📱 **Testing Your Configuration**

After making these changes:

1. **Wait 5-10 minutes** for settings to propagate
2. **Clear your browser cache** and localStorage
3. **Test authentication flows** in your application
4. **Monitor the logs** for any rate limit warnings

## 🛡️ **Production Recommendations**

For production environments:

1. **Enable CAPTCHA protection** for signup/signin
2. **Set up custom SMTP** for reliable email delivery
3. **Configure backup authentication** methods
4. **Monitor usage regularly** and adjust limits as needed
5. **Set up alerts** for rate limit threshold breaches

---

## ❓ **Need Help?**

If you continue experiencing rate limit issues after these changes:

1. Check the Supabase status page
2. Contact Supabase support with your project reference
3. Consider upgrading to a higher tier plan if needed
4. Implement additional client-side caching strategies

Remember: These settings balance security, performance, and rate limit prevention for your specific use case.
