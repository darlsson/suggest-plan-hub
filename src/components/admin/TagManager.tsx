import { useState, useEffect } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAppData } from '@/hooks/useAppData';

interface TagManagerProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagManager({ selectedTags, onTagsChange, placeholder = "Add tags..." }: TagManagerProps) {
  const { getAvailableTags } = useAppData();
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  useEffect(() => {
    setAvailableTags(getAvailableTags());
  }, [getAvailableTags]);

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (normalizedTag && !selectedTags.includes(normalizedTag)) {
      onTagsChange([...selectedTags, normalizedTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddNewTag = () => {
    if (newTag.trim()) {
      addTag(newTag);
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewTag();
    } else if (e.key === 'Escape') {
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const filteredAvailableTags = availableTags.filter(tag => 
    !selectedTags.includes(tag) && 
    tag.toLowerCase().includes(newTag.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="flex items-center gap-1 pr-1"
            >
              <Tag className="h-3 w-3" />
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 hover:bg-transparent"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tag Input/Dropdown */}
      <div className="flex gap-2">
        {isAddingTag ? (
          <div className="flex-1 flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter tag name..."
              className="flex-1"
              autoFocus
            />
            <Button 
              onClick={handleAddNewTag}
              disabled={!newTag.trim()}
              size="sm"
            >
              Add
            </Button>
            <Button 
              onClick={() => {
                setNewTag('');
                setIsAddingTag(false);
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {placeholder}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 max-h-64 overflow-y-auto bg-background border">
              {filteredAvailableTags.length > 0 ? (
                <>
                  {filteredAvailableTags.map(tag => (
                    <DropdownMenuItem 
                      key={tag} 
                      onClick={() => addTag(tag)}
                      className="flex items-center gap-2"
                    >
                      <Tag className="h-4 w-4" />
                      {tag}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem 
                    onClick={() => setIsAddingTag(true)}
                    className="flex items-center gap-2 border-t mt-1 pt-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add new tag
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem 
                  onClick={() => setIsAddingTag(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add new tag
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}