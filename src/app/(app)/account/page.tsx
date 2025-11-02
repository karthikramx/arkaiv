import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Account() {
  return (
    <div>
      <div className="w-full max-w-md">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="2fa">Multi-factor authentication</FieldLabel>
            <FieldDescription>
              Enable multi-factor authentication. If you do not have a
              two-factor device, you can use a one-time code sent to your email.
            </FieldDescription>
          </FieldContent>
          <Switch id="2fa" />
        </Field>
      </div>
      <div className="w-full max-w-4xl">
        <form>
          <FieldSet>
            <FieldLegend>Profile</FieldLegend>
            <FieldDescription>
              Fill in your profile information.
            </FieldDescription>
            <FieldSeparator />
            <FieldGroup>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <FieldDescription>
                    Provide your full name for identification
                  </FieldDescription>
                </FieldContent>
                <Input id="name" placeholder="Evil Rabbit" required />
              </Field>
              <FieldSeparator />
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="lastName">Message</FieldLabel>
                  <FieldDescription>
                    You can write your message here. Keep it short, preferably
                    under 100 characters.
                  </FieldDescription>
                </FieldContent>
                <Textarea
                  id="message"
                  placeholder="Hello, world!"
                  required
                  className="min-h-[100px] resize-none sm:min-w-[300px]"
                />
              </Field>
              <FieldSeparator />
              <Field orientation="responsive">
                <Button type="submit">Submit</Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </div>
      <div className="w-full max-w-md">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
              <Textarea
                id="feedback"
                placeholder="Your feedback helps us improve..."
                rows={4}
              />
              <FieldDescription>
                Share your thoughts about our service.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </div>
  );
}
