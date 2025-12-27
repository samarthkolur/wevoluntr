"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Upload, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: "",
    requiredVolunteers: "10",
    skillsRequired: "",
    causes: "",
    image: "",
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      const file = e.target.files[0];
      const data = new FormData();
      data.append("file", file);

      try {
        const res = await fetch("/api/upload/document", {
          method: "POST",
          body: data,
        });
        const json = await res.json();
        if (json.url) {
          setFormData({ ...formData, image: json.url });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        requiredVolunteers: parseInt(formData.requiredVolunteers),
        skillsRequired: formData.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean),
        causes: formData.causes.split(",").map((s) => s.trim()).filter(Boolean),
        // Ensure date is a valid object or ISO string
        date: new Date(formData.date), 
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to create event");
      }

      onSuccess();
      onClose();
      router.refresh(); // Refresh server components
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Event">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Event Title</label>
            <Input
              name="title"
              placeholder="e.g. Beach Cleanup Drive"
              required
              value={formData.title}
              onChange={handleChange}
              className="border-gray-300 focus:border-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Category</label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Category</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Community">Community</option>
              <option value="Animals">Animals</option>
              <option value="Arts">Arts</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Description</label>
          <Textarea
            name="description"
            placeholder="Describe the event, goals, and what volunteers will do..."
            required
            value={formData.description}
            onChange={handleChange}
            className="min-h-[100px] border-gray-300 focus:border-black"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Location</label>
            <Input
              name="location"
              placeholder="City, Address, or 'Remote'"
              required
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Date & Time</label>
            <Input
              name="date"
              type="datetime-local"
              required
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Volunteers Needed</label>
            <Input
              name="requiredVolunteers"
              type="number"
              min="1"
              required
              value={formData.requiredVolunteers}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-bold text-gray-700">Cover Image</label>
             <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full relative overflow-hidden"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                    {uploading ? (
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                        <Upload className="h-4 w-4 mr-2" />
                    )}
                    {formData.image ? "Change Image" : "Upload Image"}
                    <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Button>
                {formData.image && (
                    <div className="relative h-10 w-10 border rounded overflow-hidden flex-shrink-0">
                        <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, image: ""})}
                            className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}
             </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Skills Required (comma separated)</label>
          <Input
            name="skillsRequired"
            placeholder="e.g. Teaching, Painting, Coding"
            value={formData.skillsRequired}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Causes / Tags (comma separated)</label>
          <Input
            name="causes"
            placeholder="e.g. Climate Change, Youth, Literacy"
            value={formData.causes}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" className="bg-black text-white hover:bg-gray-800" disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Publish Event"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
