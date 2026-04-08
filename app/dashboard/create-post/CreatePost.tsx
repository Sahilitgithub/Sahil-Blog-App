'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CldUploadWidget } from "next-cloudinary";
import RichTextEditor from "@/components/dashboard/RichTextEditor";
import { Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export interface InputProps {
  title: string;
  slug: string;
  description: string;
  category: string;
  featured: string;
  keywords: string[];
  image?: string;
}

const CreatePost = () => {
  const router = useRouter();

  const [inputKeyword, setInputKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordError, setKeywordError] = useState("");
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InputProps>({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "",
      featured: "Latest Post",
      keywords: [],
      image: "",
    },
  });

  const image = watch("image");

  const addKeyword = () => {
    const value = inputKeyword.trim();

    if (!value) return;

    if (keywords.includes(value)) {
      toast.error("Keyword already added");
      return;
    }

    setKeywords((prev) => [...prev, value]);
    setInputKeyword("");
    setKeywordError("");
  };

  const removeKeyword = (index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<InputProps> = async (form) => {
    if (keywords.length === 0) {
      setKeywordError("At least one keyword is required");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          keywords,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to create post");
        return;
      }

      toast.success("Post created");

      router.push(`/dashboard/posts/${data.slug}`);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="bg-slate-950 rounded-md p-5">
      <h1 className="text-xl font-bold mb-4">Create Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Title */}
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Title"
          className="input"
        />
        {errors.title && <p className="error">{errors.title.message}</p>}

        {/* Slug */}
        <input
          {...register("slug", { required: "Slug is required" })}
          placeholder="Slug"
          className="input"
        />
        {errors.slug && <p className="error">{errors.slug.message}</p>}

        {/* Category */}
        <input
          {...register("category", { required: "Category is required" })}
          placeholder="Category"
          className="input"
        />
        {errors.category && <p className="error">{errors.category.message}</p>}

        {/* Featured */}
        <select {...register("featured")} className="input">
          <option value="Latest Post">Latest Post</option>
          <option value="Featured Post">Featured Post</option>
        </select>

        {/* Editor */}
        <Controller
          name="description"
          control={control}
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <RichTextEditor
              content={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.description && (
          <p className="error">{errors.description.message}</p>
        )}

        {/* Keywords */}
        <div>
          <div className="flex gap-2">
            <input
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              placeholder="Keyword"
              className="input"
            />

            <button
              type="button"
              onClick={addKeyword}
              className="bg-blue-700 px-4 rounded-md"
            >
              Add
            </button>
          </div>

          {keywordError && <p className="error">{keywordError}</p>}

          <div className="flex gap-2 flex-wrap mt-2">
            {keywords.map((word, i) => (
              <span
                key={i}
                onClick={() => removeKeyword(i)}
                className="bg-gray-800 px-2 py-1 rounded cursor-pointer"
              >
                {word} ❌
              </span>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex gap-4 items-center">

          <CldUploadWidget
            uploadPreset="blog-app"
            options={{ maxFiles: 1 }}
            onUpload={() => setUploading(true)}
            onSuccess={(result: any) => {
              if (result?.info?.secure_url) {
                setValue("image", result.info.secure_url, {
                  shouldValidate: true,
                });
              }
              setUploading(false);
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open?.()}
                disabled={uploading}
                className="bg-indigo-600 px-4 py-2 rounded flex items-center gap-2"
              >
                <ImageIcon size={16} />
                {uploading ? "Uploading..." : "Upload"}
              </button>
            )}
          </CldUploadWidget>

          <div className="w-20 h-20 bg-slate-800 rounded overflow-hidden">
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                width={80}
                height={80}
                src={image}
                alt="preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>

        </div>

        {/* Submit */}
        <button
          disabled={isSubmitting || uploading}
          className="bg-green-700 px-4 py-2 rounded"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

      </form>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 8px;
          border-radius: 6px;
          background: #0f172a;
        }
        .error {
          color: #ef4444;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default CreatePost;