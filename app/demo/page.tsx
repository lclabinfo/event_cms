import { RegistrationFormExample } from "@/components/registration-form-example"

export default function DemoPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shadcn/UI Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates the Shadcn/ui components configured for the UBF Event Registration System.
        </p>
      </div>

      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Registration Form Example</h2>
          <RegistrationFormExample />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Available Components</h2>
          <div className="grid gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">✅ Installed Components:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Button - Interactive button component with variants</li>
                <li>Card - Container component for grouping content</li>
                <li>Input - Text input field with proper styling</li>
                <li>Label - Form label component</li>
                <li>Select - Dropdown selection component</li>
                <li>Checkbox - Checkbox input with label support</li>
                <li>Dialog - Modal dialog for user interactions</li>
                <li>Alert - Alert messages with different severity levels</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">📦 Additional Components Available:</h3>
              <p className="text-sm text-muted-foreground mb-2">
                You can install more components as needed using:
              </p>
              <code className="block p-2 bg-muted rounded text-sm">
                npx shadcn@latest add [component-name]
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                Examples: toast, tabs, accordion, avatar, badge, calendar, etc.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Theme Customization</h2>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              The theme colors are configured in <code className="px-1 py-0.5 bg-muted rounded">app/globals.css</code> using CSS variables.
              You can customize the colors to match your brand by modifying the HSL values.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              The current theme supports both light and dark modes automatically.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}