"use client";

import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/ui/shadcn-io/tags";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

interface TagSelectorProps {
  tags: string[]; // List of tag strings
  onChange?: (selected: string[]) => void;
}

export default function TagSelector({ tags, onChange }: TagSelectorProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleRemove = (value: string) => {
    setSelected((prev) => {
      const updated = prev.filter((v) => v !== value);
      onChange?.(updated);
      return updated;
    });
  };

  const handleSelect = (value: string) => {
    setSelected((prev) => {
      const updated = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      onChange?.(updated);
      return updated;
    });
  };

  return (
    <Tags className="max-w-[300px]">
      <TagsTrigger>
        {selected.map((tag) => (
          <TagsValue
            className="bg-gray-200 text-gray-900 hover:bg-gray-300"
            key={tag}
            onRemove={() => handleRemove(tag)}
          >
            {tag}
          </TagsValue>
        ))}
      </TagsTrigger>
      <TagsContent>
        <TagsInput placeholder="Search tag..." />
        <TagsList>
          <TagsEmpty />
          <TagsGroup>
            {tags.map((tag) => (
              <TagsItem key={tag} onSelect={handleSelect} value={tag}>
                {tag}
                {selected.includes(tag) && (
                  <CheckIcon className="text-muted-foreground" size={14} />
                )}
              </TagsItem>
            ))}
          </TagsGroup>
        </TagsList>
      </TagsContent>
    </Tags>
  );
}
