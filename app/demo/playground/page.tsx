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
import { ChevronLeft, Copy, Check, RotateCcw, Palette, Layout } from "lucide-react"

export default function PlaygroundPage() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState("default")
  const [selectedSize, setSelectedSize] = useState("default")
  const [showAlert, setShowAlert] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    subscribe: false,
  })

  const copyToClipboard = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const resetPlayground = () => {
    setSelectedVariant("default")
    setSelectedSize("default")
    setShowAlert(true)
    setFormData({
      name: "",
      email: "",
      country: "",
      subscribe: false,
    })
  }

  const getCurrentCode = () => {
    return `// Button Component
<Button variant="${selectedVariant}" size="${selectedSize}">
  Click me
</Button>

// Form Components
<Card>
  <CardHeader>
    <CardTitle>Registration Form</CardTitle>
    <CardDescription>Fill in your details</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value="${formData.name}"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Select value="${formData.country}">
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="korea">Korea</SelectItem>
            <SelectItem value="usa">USA</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="subscribe"
          checked={${formData.subscribe}}
        />
        <Label htmlFor="subscribe">Subscribe to newsletter</Label>
      </div>
    </div>
  </CardContent>
</Card>`
  }

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/demo" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Demo
        </Link>
        <h1 className="text-4xl font-bold mb-2">Component Playground</h1>
        <p className="text-muted-foreground">
          Experiment with components and their properties in real-time
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  Component Controls
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetPlayground}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Modify component properties to see changes in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Button Controls */}
              <div className="space-y-4">
                <h3 className="font-medium">Button Properties</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="variant">Variant</Label>
                    <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                      <SelectTrigger id="variant">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="ghost">Ghost</SelectItem>
                        <SelectItem value="destructive">Destructive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger id="size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                <h3 className="font-medium">Form Data</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="playground-name">Name</Label>
                    <Input
                      id="playground-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="playground-email">Email</Label>
                    <Input
                      id="playground-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="playground-country">Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData({ ...formData, country: value })}
                    >
                      <SelectTrigger id="playground-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="korea">Korea</SelectItem>
                        <SelectItem value="usa">USA</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="uk">UK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="playground-subscribe"
                      checked={formData.subscribe}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, subscribe: checked as boolean })
                      }
                    />
                    <Label htmlFor="playground-subscribe">Subscribe to newsletter</Label>
                  </div>
                </div>
              </div>

              {/* Alert Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Alert Visibility</h3>
                  <Checkbox
                    checked={showAlert}
                    onCheckedChange={(checked) => setShowAlert(checked as boolean)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Output */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generated Code
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(getCurrentCode())}
                >
                  {copiedCode ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-md bg-muted overflow-x-auto text-xs">
                <code>{getCurrentCode()}</code>
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card className="min-h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="mr-2 h-4 w-4" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See your component combinations in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Button Preview */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Button Component</h3>
                <Button
                  variant={selectedVariant as any}
                  size={selectedSize as any}
                >
                  Click me
                </Button>
              </div>

              {/* Alert Preview */}
              {showAlert && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Alert Component</h3>
                  <Alert>
                    <AlertTitle>Notification</AlertTitle>
                    <AlertDescription>
                      This is a sample alert message in your playground.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Form Preview */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Form Components</h3>
                <Card>
                  <CardHeader>
                    <CardTitle>Registration Form</CardTitle>
                    <CardDescription>Fill in your details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="preview-name">Name</Label>
                        <Input
                          id="preview-name"
                          value={formData.name}
                          readOnly
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="preview-email">Email</Label>
                        <Input
                          id="preview-email"
                          type="email"
                          value={formData.email}
                          readOnly
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="preview-country">Country</Label>
                        <Select value={formData.country} disabled>
                          <SelectTrigger id="preview-country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="korea">Korea</SelectItem>
                            <SelectItem value="usa">USA</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="uk">UK</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="preview-subscribe"
                          checked={formData.subscribe}
                          disabled
                        />
                        <Label htmlFor="preview-subscribe">Subscribe to newsletter</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}