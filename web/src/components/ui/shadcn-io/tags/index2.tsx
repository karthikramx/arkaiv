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
import { CheckIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

interface Tag {
  id: string;
  label: string;
}

interface DocumentTagsProps {
  availableTags: Tag[];
  selectedTags: string[]; // array of tag IDs
  onChange: (updatedTags: string[]) => void;
  onCreateTag?: (newTag: Tag) => Promise<void> | void; // optional callback
}

const Tags2 = ({
  availableTags,
  selectedTags,
  onChange,
  onCreateTag,
}: DocumentTagsProps) => {
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<Tag[]>(availableTags);

  const handleRemove = (value: string) => {
    const updated = selectedTags.filter((v) => v !== value);
    onChange(updated);
  };

  const handleSelect = (value: string) => {
    const updated = selectedTags.includes(value)
      ? selectedTags.filter((v) => v !== value)
      : [...selectedTags, value];
    onChange(updated);
  };

  const handleCreateTag = async () => {
    const tag = { id: newTag.toLowerCase(), label: newTag };
    setTags((prev) => [...prev, tag]);
    onChange([...selectedTags, tag.id]);
    setNewTag("");

    if (onCreateTag) await onCreateTag(tag);
  };

  return (
    <Tags className="max-w-[300px]">
      <TagsTrigger>
        {selectedTags.map((tagId) => (
          <TagsValue key={tagId} onRemove={() => handleRemove(tagId)}>
            {tags.find((t) => t.id === tagId)?.label ?? tagId}
          </TagsValue>
        ))}
      </TagsTrigger>
      <TagsContent>
        <TagsInput onValueChange={setNewTag} placeholder="Search tag..." />
        <TagsList>
          <TagsEmpty>
            {newTag && (
              <button
                className="mx-auto flex cursor-pointer items-center gap-2"
                onClick={handleCreateTag}
                type="button"
              >
                <PlusIcon className="text-muted-foreground" size={14} />
                Create new tag: {newTag}
              </button>
            )}
          </TagsEmpty>
          <TagsGroup>
            {tags.map((tag) => (
              <TagsItem key={tag.id} onSelect={handleSelect} value={tag.id}>
                {tag.label}
                {selectedTags.includes(tag.id) && (
                  <CheckIcon className="text-muted-foreground" size={14} />
                )}
              </TagsItem>
            ))}
          </TagsGroup>
        </TagsList>
      </TagsContent>
    </Tags>
  );
};

export default Tags2;
