import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft, Code } from 'lucide-react';
import { getImagePath } from '@/lib/imageUtils';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PageContent {
  id: number;
  pageName: string;
  title: string | null;
  content: any;
  metaTitle: string | null;
  metaDescription: string | null;
  enabled: boolean;
}

export default function EditPageContent() {
  const router = useRouter();
  const { pageName } = router.query;
  const { toast } = useToast();

  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'structured' | 'json'>('structured');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [contentJson, setContentJson] = useState('');
  const [enabled, setEnabled] = useState(true);

  // Structured fields for contact page
  const [structuredContent, setStructuredContent] = useState({
    hero: { title: '', description: '' },
    location: { title: '', city: '', country: '' },
    email: { title: '', generalEmail: '', wholesaleEmail: '' },
    phone: { title: '', cell: '', whatsapp: '' },
    formHeading: '',
    workshopHours: [],
    workshopDescription: '',
    faq: [],
    socialCTA: { heading: '', description: '', socialLinks: [] }
  });

  // Structured fields for about-us page
  const [aboutContent, setAboutContent] = useState({
    hero: { title: '', description: '' },
    originStory: { heading: '', paragraphs: [''], imageUrl: '', imageAlt: '' },
    values: { heading: '', items: [{ icon: '', title: '', description: '' }] },
    quote: { text: '', author: '' },
    cta: { heading: '', description: '', buttons: [{ text: '', url: '', variant: 'primary' }] }
  });

  useEffect(() => {
    if (pageName) {
      fetchPageContent();
    }
  }, [pageName]);

  const fetchPageContent = async () => {
    try {
      const response = await fetch(`/api/admin/page-content/${pageName}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched page content:', data);
        setPageContent(data);
        setTitle(data.title || '');
        setMetaTitle(data.metaTitle || '');
        setMetaDescription(data.metaDescription || '');
        setContentJson(JSON.stringify(data.content, null, 2));
        setEnabled(data.enabled);
        
        // Initialize structured content if exists
        if (data.content && pageName === 'contact') {
          console.log('Setting structured content:', data.content);
          setStructuredContent(data.content);
        } else if (data.content && pageName === 'about-us') {
          console.log('Setting About Us content:', data.content);
          setAboutContent(data.content);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch page content:', errorData);
      }
    } catch (error) {
      console.error('Error fetching page content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      let parsedContent;
      
      if (viewMode === 'structured' && pageName === 'contact') {
        // Use structured content for contact page
        parsedContent = structuredContent;
      } else if (viewMode === 'structured' && pageName === 'about-us') {
        // Use structured content for about-us page
        parsedContent = aboutContent;
      } else {
        // Validate JSON
        try {
          parsedContent = JSON.parse(contentJson);
        } catch (e) {
          toast({
            title: 'Invalid JSON',
            description: 'Please check your content JSON is valid',
            variant: 'destructive'
          });
          setSaving(false);
          return;
        }
      }

      const response = await fetch(`/api/admin/page-content/${pageName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || null,
          metaTitle: metaTitle || null,
          metaDescription: metaDescription || null,
          content: parsedContent,
          enabled
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Page content saved successfully'
        });
        fetchPageContent();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save page content',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('files', file);

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await uploadRes.json();
      
      if (!data.files || data.files.length === 0) {
        throw new Error('No files returned from upload');
      }
      
      const uploadedFile = data.files[0];
      const filename = uploadedFile.filename; // Get the filename from the uploaded file

      // Update the aboutContent with the new image URL
      setAboutContent({
        ...aboutContent,
        originStory: {
          ...aboutContent.originStory,
          imageUrl: filename
        }
      });

      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  const isContactPage = pageName === 'contact';
  const isAboutPage = pageName === 'about-us';

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/page-content">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {pageContent?.title || pageName}
              </h1>
              <p className="text-neutral">Editing: {pageName}</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Edit Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Page title and metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter page title"
                />
              </div>

              <div>
                <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO title for search engines"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="SEO description for search engines"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
                <Label htmlFor="enabled">Published</Label>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Page Content</CardTitle>
                  <CardDescription>
                    {isContactPage 
                      ? 'Edit the contact page content using the structured form below'
                      : isAboutPage
                      ? 'Edit the About Us page content using the structured form below'
                      : 'Edit the page content as JSON. Structure the content as needed for your page template.'}
                  </CardDescription>
                </div>
                {(isContactPage || isAboutPage) && (
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'structured' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('structured')}
                    >
                      Form
                    </Button>
                    <Button
                      variant={viewMode === 'json' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('json')}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'json' ? (
                <Textarea
                  value={contentJson}
                  onChange={(e) => setContentJson(e.target.value)}
                  placeholder='{"hero": {"title": "...", "description": "..."}}'
                  className="font-mono text-sm"
                  rows={20}
                />
              ) : isContactPage ? (
                <Tabs defaultValue="hero" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="contact">Contact Info</TabsTrigger>
                    <TabsTrigger value="form">Form</TabsTrigger>
                    <TabsTrigger value="workshop">Workshop</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                  </TabsList>
                  
                  {/* Hero Section */}
                  <TabsContent value="hero" className="space-y-4">
                    <div>
                      <Label>Hero Title</Label>
                      <Input
                        value={structuredContent.hero.title}
                        onChange={(e) => setStructuredContent({
                          ...structuredContent,
                          hero: { ...structuredContent.hero, title: e.target.value }
                        })}
                        placeholder="Contact Us"
                      />
                    </div>
                    <div>
                      <Label>Hero Description</Label>
                      <Textarea
                        value={structuredContent.hero.description}
                        onChange={(e) => setStructuredContent({
                          ...structuredContent,
                          hero: { ...structuredContent.hero, description: e.target.value }
                        })}
                        placeholder="We'd love to hear from you..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  {/* Contact Info */}
                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Location Title</Label>
                        <Input
                          value={structuredContent.location.title}
                          onChange={(e) => setStructuredContent({
                            ...structuredContent,
                            location: { ...structuredContent.location, title: e.target.value }
                          })}
                          placeholder="Visit Our Workshop"
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input
                          value={structuredContent.location.city}
                          onChange={(e) => setStructuredContent({
                            ...structuredContent,
                            location: { ...structuredContent.location, city: e.target.value }
                          })}
                          placeholder="Johannesburg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Input
                        value={structuredContent.location.country}
                        onChange={(e) => setStructuredContent({
                          ...structuredContent,
                          location: { ...structuredContent.location, country: e.target.value }
                        })}
                        placeholder="South Africa"
                      />
                    </div>
                    <div className="border-t pt-4 space-y-4">
                      <h4 className="font-semibold">Email Section</h4>
                      <div>
                        <Label>Email Title</Label>
                        <Input
                          value={structuredContent.email.title}
                          onChange={(e) => setStructuredContent({
                            ...structuredContent,
                            email: { ...structuredContent.email, title: e.target.value }
                          })}
                          placeholder="Email Us"
                        />
                      </div>
                      <div>
                        <Label>General Email</Label>
                        <Input
                          value={structuredContent.email.generalEmail}
                          onChange={(e) => setStructuredContent({
                            ...structuredContent,
                            email: { ...structuredContent.email, generalEmail: e.target.value }
                          })}
                          placeholder="info@charna.co.za"
                        />
                      </div>
                      <div>
                        <Label>Wholesale Email</Label>
                        <Input
                          value={structuredContent.email.wholesaleEmail}
                          onChange={(e) => setStructuredContent({
                            ...structuredContent,
                            email: { ...structuredContent.email, wholesaleEmail: e.target.value }
                          })}
                          placeholder="wholesale@charna.co.za"
                        />
                      </div>
                    </div>
                    <div className="border-t pt-4 space-y-4">
                      <h4 className="font-semibold">Phone Section</h4>
                      <div>
                        <Label>Phone Title</Label>
                        <Input
                          value={structuredContent.phone.title}
                          onChange={(e) => setStructuredContent({
                            ...structuredContent,
                            phone: { ...structuredContent.phone, title: e.target.value }
                          })}
                          placeholder="Call or Chat"
                        />
                      </div>
                      <div>
                        <Label>Cell Number</Label>
                        <Input
                          value={structuredContent.phone.cell}
                          onChange={(e) => setStructuredContent({
                            ...structuredContent,
                            phone: { ...structuredContent.phone, cell: e.target.value }
                          })}
                          placeholder="072 356 0321"
                        />
                      </div>
                      <div>
                        <Label>WhatsApp Number</Label>
                        <Input
                          value={structuredContent.phone.whatsapp}
                          onChange={(e) => setStructuredContent({
                            ...structuredContent,
                            phone: { ...structuredContent.phone, whatsapp: e.target.value }
                          })}
                          placeholder="27723560321"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Form & Workshop */}
                  <TabsContent value="form" className="space-y-4">
                    <div>
                      <Label>Contact Form Heading</Label>
                      <Input
                        value={structuredContent.formHeading}
                        onChange={(e) => setStructuredContent({
                          ...structuredContent,
                          formHeading: e.target.value
                        })}
                        placeholder="Send Us a Message"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="workshop" className="space-y-4">
                    <div>
                      <Label>Workshop Description</Label>
                      <Textarea
                        value={structuredContent.workshopDescription}
                        onChange={(e) => setStructuredContent({
                          ...structuredContent,
                          workshopDescription: e.target.value
                        })}
                        placeholder="We welcome visitors to our workshop..."
                        rows={4}
                      />
                    </div>
                    <p className="text-sm text-neutral">Note: Workshop hours are managed via JSON for now</p>
                  </TabsContent>

                  <TabsContent value="faq" className="space-y-4">
                    <p className="text-sm text-neutral">FAQ items are managed via JSON for now</p>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-4">
                    <div>
                      <Label>Social CTA Heading</Label>
                      <Input
                        value={structuredContent.socialCTA.heading}
                        onChange={(e) => setStructuredContent({
                          ...structuredContent,
                          socialCTA: { ...structuredContent.socialCTA, heading: e.target.value }
                        })}
                        placeholder="Connect With Us on Social Media"
                      />
                    </div>
                    <div>
                      <Label>Social CTA Description</Label>
                      <Textarea
                        value={structuredContent.socialCTA.description}
                        onChange={(e) => setStructuredContent({
                          ...structuredContent,
                          socialCTA: { ...structuredContent.socialCTA, description: e.target.value }
                        })}
                        placeholder="Follow our journey..."
                        rows={3}
                      />
                    </div>
                    <p className="text-sm text-neutral">Note: Social links are managed via JSON for now</p>
                  </TabsContent>
                </Tabs>
              ) : isAboutPage ? (
                <Tabs defaultValue="hero" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="origin">Origin Story</TabsTrigger>
                    <TabsTrigger value="values">Values</TabsTrigger>
                    <TabsTrigger value="quote">Quote</TabsTrigger>
                    <TabsTrigger value="cta">Call to Action</TabsTrigger>
                  </TabsList>
                  
                  {/* Hero Section */}
                  <TabsContent value="hero" className="space-y-4">
                    <div>
                      <Label>Hero Title</Label>
                      <Input
                        value={aboutContent.hero.title}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          hero: { ...aboutContent.hero, title: e.target.value }
                        })}
                        placeholder="Our Story"
                      />
                    </div>
                    <div>
                      <Label>Hero Description</Label>
                      <Textarea
                        value={aboutContent.hero.description}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          hero: { ...aboutContent.hero, description: e.target.value }
                        })}
                        placeholder="Crafted with pride in Johannesburg..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  {/* Origin Story */}
                  <TabsContent value="origin" className="space-y-4">
                    <div>
                      <Label>Origin Story Heading</Label>
                      <Input
                        value={aboutContent.originStory.heading}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          originStory: { ...aboutContent.originStory, heading: e.target.value }
                        })}
                        placeholder="Crafted with Pride in Johannesburg"
                      />
                    </div>
                    <div>
                      <Label>Origin Story Image</Label>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          }}
                          disabled={uploadingImage}
                        />
                        {aboutContent.originStory.imageUrl && (
                          <div className="mt-2">
                            <p className="text-sm text-neutral mb-2">Current image: {aboutContent.originStory.imageUrl}</p>
                            {aboutContent.originStory.imageUrl && (
                              <div className="w-32 h-32 border rounded overflow-hidden">
                                <img 
                                  src={getImagePath(aboutContent.originStory.imageUrl)}
                                  alt={aboutContent.originStory.imageAlt}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {uploadingImage && (
                          <p className="text-sm text-primary">Uploading image...</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Image Alt Text</Label>
                      <Input
                        value={aboutContent.originStory.imageAlt}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          originStory: { ...aboutContent.originStory, imageAlt: e.target.value }
                        })}
                        placeholder="Charna. tennis bag with Johannesburg skyline"
                      />
                    </div>
                    <div>
                      <Label>Paragraphs (one per line)</Label>
                      <Textarea
                        value={aboutContent.originStory.paragraphs.join('\n')}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          originStory: { ...aboutContent.originStory, paragraphs: e.target.value.split('\n').filter(p => p.trim()) }
                        })}
                        placeholder="First paragraph..."
                        rows={6}
                      />
                    </div>
                  </TabsContent>

                  {/* Values */}
                  <TabsContent value="values" className="space-y-4">
                    <div>
                      <Label>Values Heading</Label>
                      <Input
                        value={aboutContent.values.heading}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          values: { ...aboutContent.values, heading: e.target.value }
                        })}
                        placeholder="Our Values"
                      />
                    </div>
                    <p className="text-sm text-neutral">Note: Values items are managed via JSON for now</p>
                  </TabsContent>

                  {/* Quote */}
                  <TabsContent value="quote" className="space-y-4">
                    <div>
                      <Label>Quote Text</Label>
                      <Textarea
                        value={aboutContent.quote.text}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          quote: { ...aboutContent.quote, text: e.target.value }
                        })}
                        placeholder='Every Charna. piece represents...'
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Quote Author</Label>
                      <Input
                        value={aboutContent.quote.author}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          quote: { ...aboutContent.quote, author: e.target.value }
                        })}
                        placeholder="— Founder, Charna."
                      />
                    </div>
                  </TabsContent>

                  {/* CTA */}
                  <TabsContent value="cta" className="space-y-4">
                    <div>
                      <Label>CTA Heading</Label>
                      <Input
                        value={aboutContent.cta.heading}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          cta: { ...aboutContent.cta, heading: e.target.value }
                        })}
                        placeholder="Experience the Charna. Difference"
                      />
                    </div>
                    <div>
                      <Label>CTA Description</Label>
                      <Textarea
                        value={aboutContent.cta.description}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          cta: { ...aboutContent.cta, description: e.target.value }
                        })}
                        placeholder="When you purchase a Charna. bag..."
                        rows={3}
                      />
                    </div>
                    <p className="text-sm text-neutral">Note: CTA buttons are managed via JSON for now</p>
                  </TabsContent>
                </Tabs>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Save Button (Bottom) */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
