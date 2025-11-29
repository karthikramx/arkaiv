"use client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Shield, MessageSquare, Settings } from "lucide-react";

export default function Account() {
  return (
    <div className="bg-gray-50/50 p-5 min-h-screen">
      <div className="max-w-full mx-auto space-y-5">
        {/* Main Content Grid */}
        <div className="flex justify-center">
          {/* Account Settings Card */}
          <Card className="w-full max-w-none rounded-sm">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Settings className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and team settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preferences Section */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Settings className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Preferences</h3>
                    <p className="text-sm text-muted-foreground">
                      Customize your experience
                    </p>
                  </div>
                </div>

                <div className="pl-11 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">Dark mode</div>
                      <div className="text-sm text-muted-foreground">
                        Switch to dark theme
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="font-medium">Language</div>
                    <select className="w-full max-w-xs p-2 border rounded-md bg-background">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>

              <Separator className="my-3" />

              {/* Security Section */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Protect your account
                    </p>
                  </div>
                </div>

                <div className="pl-11 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">
                        Multi-factor authentication
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch id="2fa" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="font-medium">Password</div>
                    <div className="text-sm text-muted-foreground">
                      Last changed 30 days ago
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-3" />

              {/* Feedback Section */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Feedback</h3>
                    <p className="text-sm text-muted-foreground">
                      Help us improve
                    </p>
                  </div>
                </div>

                <div className="pl-11 space-y-3">
                  <Textarea
                    id="feedback"
                    placeholder="Share your thoughts about our service..."
                    rows={3}
                    className="resize-none"
                  />
                  <div className="text-sm text-muted-foreground">
                    Your feedback helps us make the platform better
                  </div>
                  <Button className="w-full max-w-xs">Submit Feedback</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
