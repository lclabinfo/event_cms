"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy, Check, ChevronLeft, Code, Eye } from "lucide-react"

// Component showcase data
const components = [
  {
    id: "button",
    name: "Button",
    description: "Interactive button component with multiple variants",
    category: "Actions",
  },
  {
    id: "card",
    name: "Card",
    description: "Container component for grouping related content",
    category: "Layout",
  },
  {
    id: "input",
    name: "Input",
    description: "Text input field with consistent styling",
    category: "Form",
  },
  {
    id: "select",
    name: "Select",
    description: "Dropdown selection component",
    category: "Form",
  },
  {
    id: "checkbox",
    name: "Checkbox",
    description: "Checkbox input with label support",
    category: "Form",
  },
  {
    id: "alert",
    name: "Alert",
    description: "Alert messages with different severity levels",
    category: "Feedback",
  },
  {
    id: "dialog",
    name: "Dialog",
    description: "Modal dialog for user interactions",
    category: "Overlay",
  },
]

export default function ComponentsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview")

  const categories = ["all", ...Array.from(new Set(components.map(c => c.category)))]

  const filteredComponents = selectedCategory === "all"
    ? components
    : components.filter(c => c.category === selectedCategory)

  const copyToClipboard = async (code: string, componentId: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(componentId)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getComponentCode = (id: string) => {
    const codeExamples: Record<string, string> = {
      button: `<Button variant="default">Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>`,

      card: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>`,

      input: `<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>`,

      select: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>`,

      checkbox: `<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`,

      alert: `<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>`,

      dialog: `<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description goes here.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    }
    return codeExamples[id] || ""
  }

  const renderComponentPreview = (id: string) => {
    switch (id) {
      case "button":
        return (
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        )

      case "card":
        return (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here</p>
            </CardContent>
          </Card>
        )

      case "input":
        return (
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="demo-input">Email</Label>
            <Input id="demo-input" type="email" placeholder="Enter your email" />
          </div>
        )

      case "select":
        return (
          <Select>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id="demo-checkbox" />
            <Label htmlFor="demo-checkbox">Accept terms and conditions</Label>
          </div>
        )

      case "alert":
        return (
          <Alert className="w-full max-w-md">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the cli.
            </AlertDescription>
          </Alert>
        )

      case "dialog":
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  Dialog description goes here.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/demo" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Demo
        </Link>
        <h1 className="text-4xl font-bold mb-2">Component Gallery</h1>
        <p className="text-muted-foreground">
          Browse and preview all available UI components. Click to view code examples.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={viewMode === "preview" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("preview")}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button
          variant={viewMode === "code" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("code")}
        >
          <Code className="mr-2 h-4 w-4" />
          Code
        </Button>
      </div>

      {/* Component Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredComponents.map((component) => (
          <Card key={component.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{component.name}</CardTitle>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                  {component.category}
                </span>
              </div>
              <CardDescription>{component.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "preview" ? (
                <div className="p-4 border rounded-md bg-background min-h-[120px] flex items-center justify-center">
                  {renderComponentPreview(component.id)}
                </div>
              ) : (
                <div className="relative">
                  <pre className="p-4 border rounded-md bg-muted overflow-x-auto text-xs">
                    <code>{getComponentCode(component.id)}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(getComponentCode(component.id), component.id)}
                  >
                    {copiedCode === component.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}