import { useState, useEffect } from 'react';

interface LandingPageImage {
  id: number;
  imageUrl: string;
  altText: string;
  caption: string | null;
  linkUrl: string | null;
  order: number;
  enabled: boolean;
  metadata: any;
}

interface LandingPageSection {
  id: number;
  name: string;
  title: string | null;
  subtitle: string | null;
  enabled: boolean;
  order: number;
  settings: any;
  images: LandingPageImage[];
}

export function useLandingPageSection(sectionName: string) {
  const [section, setSection] = useState<LandingPageSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSection() {
      try {
        const res = await fetch(`/api/landing-page/${sectionName}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch section: ${res.status}`);
        }

        const data = await res.json();
        
        if (mounted) {
          setSection(data);
          setError(null);
        }
      } catch (err: any) {
        console.error(`Error fetching ${sectionName} section:`, err);
        if (mounted) {
          setError(err.message || 'Failed to load section');
          setSection(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchSection();

    return () => {
      mounted = false;
    };
  }, [sectionName]);

  return { section, loading, error };
}

