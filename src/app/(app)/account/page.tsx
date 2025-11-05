import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Shield, Users, MessageSquare, Settings } from "lucide-react";

export default function Account() {
  return (
    <div className="bg-gray-50/50 p-5">
      <div className="max-w-10xl mx-auto space-y-5">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account preferences and team settings
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* Security Settings Card */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security</CardTitle>
                  <CardDescription>Protect your account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Multi-factor authentication</div>
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
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Preferences Card */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Email notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive updates about your documents
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
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
                <select className="w-full p-2 border rounded-md bg-background">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Team Management Card */}
          <Card className="col-span-1 lg:col-span-1 xl:col-span-1">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Team Management</CardTitle>
                  <CardDescription>
                    Invite and manage team members
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Invite Section */}
              <div className="space-y-3">
                <div className="font-medium">Invite New Member</div>
                <div className="flex gap-2">
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="Enter email address"
                    className="flex-1"
                  />
                  <Button>Send Invite</Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Invite a new user to join your team workspace
                </div>
              </div>

              <Separator />

              {/* Team Members Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Team Members</div>
                  <Badge variant="secondary">3 members</Badge>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://via.placeholder.com/40" />
                        <AvatarFallback>U1</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">user1@example.com</div>
                        <div className="text-sm text-muted-foreground">
                          Joined 2 months ago
                        </div>
                      </div>
                    </div>
                    <Badge>Admin</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://via.placeholder.com/40" />
                        <AvatarFallback>U2</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">user2@example.com</div>
                        <div className="text-sm text-muted-foreground">
                          Joined 1 month ago
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">Member</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://via.placeholder.com/40" />
                        <AvatarFallback>U3</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">user3@example.com</div>
                        <div className="text-sm text-muted-foreground">
                          Joined 2 weeks ago
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">Member</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Card */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Feedback</CardTitle>
                  <CardDescription>Help us improve</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="feedback"
                placeholder="Share your thoughts about our service..."
                rows={4}
                className="resize-none"
              />
              <div className="text-sm text-muted-foreground">
                Your feedback helps us make the platform better
              </div>
              <Button className="w-full">Submit Feedback</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
