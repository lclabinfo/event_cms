import { RegistrationFormExample } from "@/components/registration-form-example"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, Layout, TestTube } from "lucide-react"

export default function DemoPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shadcn/UI Demo Hub</h1>
        <p className="text-muted-foreground">
          Component development and testing environment for the UBF Event Registration System
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Link href="/demo/components">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Component Gallery
              </CardTitle>
              <CardDescription>
                Browse all available components with live previews and code examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Components
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/demo/playground">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="mr-2 h-5 w-5" />
                Playground
              </CardTitle>
              <CardDescription>
                Experiment with component properties and combinations in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Open Playground
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-shadow h-full opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layout className="mr-2 h-5 w-5" />
              Templates
            </CardTitle>
            <CardDescription>
              Ready-to-use component patterns and layouts (Coming Soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
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