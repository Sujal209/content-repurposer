'use client';

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PasswordStrength } from '@/components/ui/password-strength';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/components/ui/toast';
import { 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  CreditCard, 
  BarChart3, 

  Eye,
  EyeOff,
  Loader2,
  Search,
  CheckCircle,
  Clock,

} from 'lucide-react';
import { useProductionAuth } from '@/lib/auth-context-production';
import Footer from '@/components/footer';

export default function SettingsPage() {
  const { user, signOut } = useProductionAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [fullName, setFullName] = useState('');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });



  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [profileRes, usageRes, analyticsRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/usage'),
        fetch('/api/analytics')
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.profile);
        setFullName(profileData.profile.full_name || '');
      }

      if (usageRes.ok) {
        const usageData = await usageRes.json();
        setUsage(usageData);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.analytics);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({ type: 'error', title: 'Failed to load settings data' });
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName })
      });

      if (response.ok) {
        setProfile((prev: any) => ({ ...prev, full_name: fullName }));
        toast({ type: 'success', title: 'Profile updated successfully' });
      } else {
        const errorData = await response.json();
        console.error('Profile update failed:', response.status, errorData);
        toast({ type: 'error', title: errorData.error || 'Failed to update profile' });
      }
    } catch (error) {
      toast({ type: 'error', title: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const filteredSections = (content: string) => {
    if (!searchQuery) return true;
    return content.toLowerCase().includes(searchQuery.toLowerCase());
  };



  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({ type: 'error', title: 'New passwords do not match' });
      return;
    }

    if (passwords.new.length < 8) {
      toast({ type: 'error', title: 'Password must be at least 8 characters' });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: passwords.new })
      });

      if (response.ok) {
        setPasswords({ current: '', new: '', confirm: '' });
        toast({ type: 'success', title: 'Password updated successfully' });
      } else {
        const error = await response.json();
        toast({ type: 'error', title: error.error || 'Failed to update password' });
      }
    } catch (error) {
      toast({ type: 'error', title: 'Failed to update password' });
    } finally {
      setSaving(false);
    }
  };

  const confirmPasswordChange = () => {
    setConfirmAction(() => handlePasswordChange);
    setShowConfirmDialog(true);
  };





  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };



  if (!user) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
        <div className="data-lines" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/5 to-background" />
        
        <div className="flex items-center justify-center min-h-[400px] relative z-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2 text-heading">Please Sign In</h1>
            <p className="text-muted">You need to be signed in to access settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="data-lines" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/5 to-background" />
      
      {/* Header */}
      <header className="border-b border-border bg-card-bg/80 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-muted hover:text-foreground"
              >
                ← Back to Dashboard
              </Button>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 flex-1 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-heading gradient-text">Settings</h1>
                <p className="text-muted mt-1">
                  Manage your account settings and preferences.
                </p>
              </div>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  aria-label="Search settings"
                />
              </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Information */}
              <TabsContent value="profile">
                <div className="grid gap-6">
                  <Card className="bg-card-bg/50 backdrop-blur-xl border border-border neon-glow-blue">
                    <CardHeader>
                      <CardTitle className="text-heading flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription className="text-muted">
                        Update your personal information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Profile Photo */}
                      <div className="flex items-center gap-6">
                        <Avatar size="xl">
                          <AvatarImage src={profile?.avatar_url} alt="Profile" />
                          <AvatarFallback>
                            {(fullName || user.email)?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <label className="text-sm font-medium text-heading">Display Name</label>
                          <Input 
                            placeholder="Enter your display name" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="max-w-sm"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-heading">Email Address</label>
                        <div className="relative max-w-sm">
                          <Input 
                            value={user.email || ''} 
                            disabled 
                            className="bg-surface/30 pr-10" 
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {user.email_confirmed_at ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted">
                          {user.email_confirmed_at ? 'Email verified' : 'Email verification pending'}
                        </p>
                      </div>



                      <div className="flex justify-end">
                        <Button 
                          className="cyber-button" 
                          disabled={saving}
                          onClick={saveProfile}
                        >
                          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Account Security */}
              <TabsContent value="security">
                <div className="grid gap-6">
                  {/* Change Password */}
                  <Card className="bg-card-bg/50 backdrop-blur-xl border border-border neon-glow-pink">
                    <CardHeader>
                      <CardTitle className="text-heading flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Change Password
                      </CardTitle>
                      <CardDescription className="text-muted">
                        Update your password to keep your account secure.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-heading">Current Password</label>
                        <div className="relative">
                          <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Enter current password"
                            value={passwords.current}
                            onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-heading">New Password</label>
                          <div className="space-y-3">
                            <Input 
                              type="password" 
                              placeholder="Enter new password"
                              value={passwords.new}
                              onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                            />
                            <PasswordStrength password={passwords.new} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-heading">Confirm Password</label>
                          <Input 
                            type="password" 
                            placeholder="Confirm new password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          variant="secondary" 
                          onClick={confirmPasswordChange}
                          disabled={saving || !passwords.new || !passwords.confirm}
                        >
                          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Update Password
                        </Button>
                      </div>


                    </CardContent>
                  </Card>


                </div>
              </TabsContent>

              {/* Billing & Plan */}
              <TabsContent value="billing">
                <div className="grid gap-6">
                  {/* Current Plan */}
                  <Card className="bg-card-bg/50 backdrop-blur-xl border border-border animate-gradient-border">
                    <CardHeader>
                      <CardTitle className="text-heading flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Current Plan Details
                      </CardTitle>
                      <CardDescription className="text-muted">
                        Manage your subscription and billing information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center p-4 rounded-lg bg-surface/30 border border-primary/20">
                          <h3 className="font-semibold text-heading">Plan Type</h3>
                          <p className="text-2xl font-bold gradient-text mt-2 capitalize">{profile?.plan || 'Free'}</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-surface/30 border border-secondary/20">
                          <h3 className="font-semibold text-heading">Credits Remaining</h3>
                          <p className="text-2xl font-bold text-secondary mt-2">{usage?.remaining || 0}</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-surface/30 border border-accent/20">
                          <h3 className="font-semibold text-heading">Daily Limit</h3>
                          <p className="text-2xl font-bold text-accent mt-2">{usage?.limit || 0}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-heading">Usage Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted">Content Transformations</span>
                            <span className="text-sm font-medium text-heading">{usage?.used || 0} / {usage?.limit || 0}</span>
                          </div>
                          <div className="w-full bg-surface rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" 
                              style={{width: `${usage?.limit ? (usage.used / usage.limit) * 100 : 0}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="cyber-button">
                          Upgrade Plan
                        </Button>
                        <Button variant="outline">
                          View Billing History
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Usage Analytics */}
              <TabsContent value="analytics">
                <div className="grid gap-6">
                  <Card className="bg-card-bg/50 backdrop-blur-xl border border-border neon-glow-blue">
                    <CardHeader>
                      <CardTitle className="text-heading flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Usage Analytics
                      </CardTitle>
                      <CardDescription className="text-muted">
                        Track your content transformation usage and patterns.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Monthly Usage Graph Placeholder */}
                      <div className="h-64 bg-surface/30 rounded-lg border border-border flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-muted mx-auto mb-2" />
                          <p className="text-muted">Monthly Usage Graph</p>
                          <p className="text-xs text-muted mt-1">Chart visualization coming soon</p>
                        </div>
                      </div>

                      {/* Content History */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-heading">Recent Transformations</h4>
                        <div className="space-y-2">
                          {(analytics?.recentTransformations || []).slice(0, 5).map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-surface/20 rounded-lg border border-border/50">
                              <div>
                                <p className="font-medium text-heading">{item.type}</p>
                                <p className="text-xs text-muted">{item.date}</p>
                              </div>
                              <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Credit Usage Breakdown */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-heading">Credit Usage Breakdown</h4>
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="text-center p-3 bg-surface/20 rounded-lg border border-border/50">
                            <p className="text-sm text-muted">Twitter Threads</p>
                            <p className="text-lg font-bold text-primary">{analytics?.usageBreakdown?.['Twitter Thread'] || 0}</p>
                          </div>
                          <div className="text-center p-3 bg-surface/20 rounded-lg border border-border/50">
                            <p className="text-sm text-muted">LinkedIn Posts</p>
                            <p className="text-lg font-bold text-secondary">{analytics?.usageBreakdown?.['LinkedIn Carousel'] || 0}</p>
                          </div>
                          <div className="text-center p-3 bg-surface/20 rounded-lg border border-border/50">
                            <p className="text-sm text-muted">Instagram Stories</p>
                            <p className="text-lg font-bold text-accent">{analytics?.usageBreakdown?.['Instagram Stories'] || 0}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>


            </Tabs>
          </div>
        </div>
      </main>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmAction}
        title="Confirm Password Change"
        description="Are you sure you want to change your password? You will need to sign in again on all devices."
        confirmText="Change Password"
        variant="default"
      />

      <Footer />
    </div>
  );
}
