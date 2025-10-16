import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Range {
  id: number;
  rangeName: string;
  imageUrl: string;
}

interface RangeSelectorProps {
  selectedRangeIds: number[];
  onChange: (rangeIds: number[]) => void;
}

const RangeSelector = ({ selectedRangeIds, onChange }: RangeSelectorProps) => {
  const [ranges, setRanges] = useState<Range[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanges();
  }, []);

  const fetchRanges = async () => {
    try {
      const response = await fetch('/api/landing-page/ranges');
      if (response.ok) {
        const section = await response.json();
        if (section && section.images) {
          const rangesList = section.images.map((img: any) => ({
            id: img.id,
            rangeName: img.metadata?.rangeName || img.caption || 'Unnamed Range',
            imageUrl: img.imageUrl,
          }));
          setRanges(rangesList);
        }
      }
    } catch (error) {
      console.error('Error fetching ranges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRangeToggle = (rangeId: number) => {
    const newSelection = selectedRangeIds.includes(rangeId)
      ? selectedRangeIds.filter(id => id !== rangeId)
      : [...selectedRangeIds, rangeId];
    
    onChange(newSelection);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Product Ranges</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Loading ranges...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Product Ranges</CardTitle>
        <p className="text-xs text-gray-500 mt-1">
          Select which ranges this product belongs to. These control what products appear when users click "Add to Cart" on range tiles.
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {ranges.length === 0 ? (
              <p className="text-sm text-gray-500">No ranges found. Create ranges in Landing Page CMS.</p>
            ) : (
              ranges.map((range) => (
                <div key={range.id} className="flex items-center space-x-3 p-2 hover:bg-sage/10 rounded">
                  <Checkbox
                    id={`range-${range.id}`}
                    checked={selectedRangeIds.includes(range.id)}
                    onCheckedChange={() => handleRangeToggle(range.id)}
                  />
                  <Label
                    htmlFor={`range-${range.id}`}
                    className="flex-1 cursor-pointer text-sm font-medium"
                  >
                    {range.rangeName}
                  </Label>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        {selectedRangeIds.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-botanical">
              {selectedRangeIds.length} range{selectedRangeIds.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RangeSelector;

