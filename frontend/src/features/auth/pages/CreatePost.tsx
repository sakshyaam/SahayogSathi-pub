import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import imageCompression from "browser-image-compression";

interface FormDataState {
  title: string;
  category: string;
  subject: string;
  description: string;
  budgetMin: string;
  budgetMax: string;
  deadline: string;
  isUrgent: boolean;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const { handleCreatePost, loading } = usePost();
  const [compressing, setCompressing] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    category: "assignment",
    subject: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    isUrgent: false,
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setCompressing(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, String(formData[key as keyof FormDataState]));
      });

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedAttachments = await Promise.all(
        attachments.map(async (file) => {
          if (file.type.startsWith("image/")) {
            try {
              return await imageCompression(file, options);
            } catch (err) {
              console.error("Compression failed for:", file.name, err);
              return file;
            }
          }
          return file;
        })
      );
      setCompressing(false);

      compressedAttachments.forEach((file) => {
        data.append("attachments", file);
      });

      const response = await handleCreatePost(data);
      if (response && response.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setCompressing(false);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            Create post
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
            Publish a support request
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Share what you need clearly so others can understand and respond faster.
          </p>
        </div>

        <form
          className="mt-8 space-y-6 rounded-4xl border border-zinc-200 bg-white p-6 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-800">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Write a clear post title"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
              >
                <option value="assignment">Assignment</option>
                <option value="project">Project</option>
                <option value="notes">Notes</option>
                <option value="presentation">Presentation</option>
                <option value="research">Research</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800">Subject</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Math, CS, Biology..."
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800">Min Budget</label>
              <input
                type="number"
                name="budgetMin"
                required
                value={formData.budgetMin}
                onChange={handleChange}
                placeholder="0"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800">Max Budget</label>
              <input
                type="number"
                name="budgetMax"
                required
                value={formData.budgetMax}
                onChange={handleChange}
                placeholder="0"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800">Deadline</label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800">Attachments</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-800">Description</label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain the request with enough detail"
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isUrgent"
              name="isUrgent"
              checked={formData.isUrgent}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300"
            />
            <label htmlFor="isUrgent" className="text-sm font-medium text-zinc-800">
              Is this urgent?
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              className="rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Save draft
            </button>
            <button
              type="submit"
              disabled={loading || compressing}
              className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              {compressing ? "Optimizing images..." : loading ? "Publishing..." : "Publish post"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;
