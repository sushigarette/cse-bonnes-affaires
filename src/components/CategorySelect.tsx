import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  placeholder?: string;
  allowCustom?: boolean;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  categories,
  placeholder = "Sélectionnez une catégorie",
  allowCustom = true
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const handleAddCustom = () => {
    const trimmedCategory = customCategory.trim();
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      onChange(trimmedCategory);
      setCustomCategory("");
      setIsAddingCustom(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  };

  const handleAddCustomClick = () => {
    setIsAddingCustom(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {categories
              .filter(category => category && category.trim() !== "")
              .map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        
        {allowCustom && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCustomClick}
            className="px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isAddingCustom && (
        <div className="flex gap-2 p-3 border rounded-lg bg-muted/50">
          <Input
            placeholder="Nouvelle catégorie"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            autoFocus
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddCustom}
            disabled={!customCategory.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAddingCustom(false);
              setCustomCategory("");
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
