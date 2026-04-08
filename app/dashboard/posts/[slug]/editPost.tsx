'use client';
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Image as Image2 } from "lucide-react";
import RichTextEditor from "@/components/dashboard/RichTextEditor"; 

// Type of form data
type FormData = {
  title: string;
  slug: string;
  description: string;
  category: string;
  featured: string;
  keywords: string;
  image?: string; // image is managed by react-hook-form
};

// Edit post data type (from backend data structure)
interface EditPostProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  slug: string;
  image?: string | null;
  description: string;
  category?: string | null;
  featured?: string | null;
  keywords?: string | null;
  userId: string;
}

interface EditPostComponentProps {
  passPost: EditPostProps;
}

const EditPost = ({ passPost }: EditPostComponentProps) => {
  const router = useRouter();

  // Get single post data
  const post = passPost;

  // React hook form hook to default value to update
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue, // Get setValue
    watch, // Get watch
    control // Get control for Tiptap integration
  } = useForm<FormData>({
    defaultValues: {
      title: passPost.title,
      slug: passPost.slug,
      description: passPost.description,
      category: passPost.category || "",
      featured: passPost.featured || "",
      keywords: passPost.keywords || "",
      image: passPost?.image || "", // Use post image as default value
    },
  });

  const watchedImage = watch('image'); // Watch the image field for dynamic preview

  // Submit Handler Function
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // data now contains all fields including 'image' and 'description' (HTML string)
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Send the entire form data object
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }
      toast.success("Post Updated Successfully");
      router.push(`/dashboard/posts/${data.slug}`); // Redirect after successful update

    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message);
        }
    }
  };

  return (
    <section>
      {/* Header of update post */}
      <div className="flex justify-between flex-wrap items-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-red-600 rounded-md p-1 text-white"
        >
          Back
        </button>
        <h2 className="text-[15px] sm:text-[17px] bg-slate-900 p-1 rounded-md">
          Post Id: {post.id}
        </h2>
        <h1 className="text-[15px] sm:text-[17px] bg-slate-900 p-1 rounded-md">
          Edit Post
        </h1>
      </div>
      {/* Form Input Data */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-950 p-4 rounded-md"
      >
        {/* Tilte And Slug Part */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          <div>
            <label
              htmlFor="title"
              aria-label="title"
              className="text-[13px] sm:text[15px]"
            >
              Title
            </label>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
                maxLength: {
                  value: 160,
                  message: "Title cannot exceed 160 characters",
                },
              })}
              className="w-full bg-slate-800 p-3 rounded-md"
            />
            {errors.title?.message && (
              <span className="text-red-700 text-sm">
                {errors.title.message}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="slug"
              aria-label="slug"
              className="text-[13px] sm:text[15px]"
            >
              Slug/Url
            </label>
            <input
              {...register("slug", {
                required: "Slug is required",
                maxLength: {
                  value: 160,
                  message: "Slug cannot exceed 160 characters",
                },
              })}
              type="text"
              className="w-full bg-slate-800 p-3 rounded-md"
            />
            {errors.slug?.message && (
              <span className="text-red-700 text-sm">
                {errors.slug.message}
              </span>
            )}
          </div>
        </div>
        {/* Category And Latest/Featured Part */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          <div>
            <label
              htmlFor="category"
              aria-label="category"
              className="text-[13px] sm:text[15px]"
            >
              Category
            </label>
            <input
              {...register("category", {
                required: "Category is required",
              })}
              type="text"
              className="w-full bg-slate-800 p-3 rounded-md"
            />
            {errors.category?.message && (
              <span className="text-red-700 text-sm">
                {errors.category.message}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <div className="">
              <label
                htmlFor="Featured"
                area-label="Featured"
                className="text-[15px] sm:text[17px]"
              >
                Featured/Latest Post
              </label>
              <select
                {...register("featured", { required: false })}
                className="w-full border bg-slate-900 border-slate-300 rounded-md p-[10.5px] focus:outline-none focus:border-slate-500"
              >
                <option value="Latest Post">Latest Post</option>
                <option value="Featured Post">Featured Post</option>
              </select>
            </div>
          </div>
        </div>
        {/* Keywords Part */}
        <div className="grid grid-cols-1 my-3">
          <div>
            <label
              htmlFor="keywords"
              aria-label="Keywords"
              className="text-[13px] sm:text[15px]"
            >
              Keywords (comma separated)
            </label>
            <textarea
              {...register("keywords", {
                required: "Keywords are required",
                maxLength: {
                  value: 500,
                  message: "Keywords cannot exceed 500 characters",
                },
              })}
              className="w-full bg-slate-800 p-3 rounded-md"
            />
          </div>
        </div>
        
        {/* Description Part (Using Tiptap Editor via Controller) */}
        <div className="grid grid-cols-1 mt-2">
          <label
            htmlFor="description"
            aria-label="description"
            className="text-[13px] sm:text[15px]"
          >
            Description
          </label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <RichTextEditor content={field.value || ""} onChange={field.onChange} />
            )}
          />
          {errors.description && (
            <span className="text-[13px] lg:text-[14px] text-red-600">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Image upload Part */}
        <div className="flex gap-x-4 my-4">
          <div className="flex gap-4">
            <div>
             <CldUploadWidget 
             options={{
              singleUploadAutoClose: true,
              maxFiles: 1,
             }}
             uploadPreset="blog-app" // Your upload preset name
             onSuccess={(results) => {
                if(typeof results.info === 'object' && 'secure_url' in results.info){
                  const imgUrl = results.info.secure_url as string;
                  setValue('image', imgUrl, { shouldDirty: true }); // Update form value
                }
             }} >
              {({open}) => {
                return (
                  <button type="button" onClick={() => open()} 
                  className="bg-blue-800 p-2 rounded-md my-1 flex justify-center items-center" >
                    <Image2 size={16} className="inline mr-2" />
                    <span>Upload</span>
                  </button>
                )
              }}
             </CldUploadWidget>
            </div>
            <div className="w-20 h-20 bg-slate-800 rounded-md">
              {/* Display either the new URL or the existing post image URL */}
              {(watchedImage) && (
                <figure className="w-20 h-20 bg-slate-800 rounded-md">
                   <CldImage 
                      src={watchedImage}
                      width={150}
                      height={150}
                      alt="Preview"
                      className="rounded-md w-full h-full object-cover"
                    />
                </figure>
              )}
            </div>
          </div>
        </div>
        
        {/* Submiting Post On Backend */}
        <button
          type="submit"
          className="bg-green-700 px-4 rounded-md py-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Post"}
        </button>
      </form>
    </section>
  );
};

export default EditPost;

