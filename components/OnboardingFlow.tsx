"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Types
type Role = "volunteer" | "ngo_admin" | null;

export default function OnboardingFlow() {
  const [role, setRole] = useState<Role>(null);
  const router = useRouter();
  const { update } = useSession();

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {!role && (
            <RoleSelection key="role-selection" onSelect={handleRoleSelect} />
          )}
          {role === "volunteer" && (
            <VolunteerFlow key="volunteer-flow" updateSession={update} />
          )}
          {role === "ngo_admin" && (
            <NGOFlow key="ngo-flow" updateSession={update} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RoleSelection({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="text-center border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
        <CardHeader className="bg-lime-100 border-b-2 border-black p-8">
          <CardTitle className="text-4xl font-black text-black tracking-tight">Welcome to Voluntr</CardTitle>
          <CardDescription className="text-gray-700 font-medium text-lg">Choose your path to make a difference.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-6 justify-center p-8">
          <Button
            variant="outline"
            className="h-40 w-full sm:w-56 flex flex-col gap-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:bg-lime-50 transition-all rounded-xl"
            onClick={() => onSelect("volunteer")}
          >
            <span className="text-5xl">🤝</span>
            <span className="font-bold text-xl text-black">Volunteer</span>
          </Button>
          <Button
            variant="outline"
            className="h-40 w-full sm:w-56 flex flex-col gap-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:bg-lime-50 transition-all rounded-xl"
            onClick={() => onSelect("ngo_admin")}
          >
            <span className="text-5xl">🏢</span>
            <span className="font-bold text-xl text-black">NGO / Organization</span>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Volunteer Flow ---

function VolunteerFlow({ updateSession }: { updateSession: (data?: any) => Promise<any> }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    legalName: "",
    phone: "",
    dob: "",
    location: "",
    maxDistanceKm: 10,
    skills: "",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboard/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(",").map((s) => s.trim()),
          interests: formData.interests.split(",").map((s) => s.trim()),
        }),
      });
      if (res.ok) {
        await updateSession({ role: "volunteer", isProfileComplete: true });
        router.push("/dashboard/volunteer");
      } else {
        const errorData = await res.json();
        console.error("Onboarding failed:", res.status, res.statusText, errorData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-black">Basic Info</h3>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Legal Name</label>
          <Input name="legalName" value={formData.legalName} onChange={handleChange} placeholder="John Doe" required className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Phone</label>
          <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" required className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Date of Birth</label>
          <Input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
      </div>
    ),
    (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-black">Location & Preferences</h3>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">City / Location</label>
          <Input name="location" value={formData.location} onChange={handleChange} placeholder="New York, NY" required className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Max Travel Distance (km)</label>
          <Input type="number" name="maxDistanceKm" value={formData.maxDistanceKm} onChange={handleChange} required className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
      </div>
    ),
    (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-black">Skills & Interests</h3>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Skills (comma separated)</label>
          <Textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="Teaching, Coding, First Aid" className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Causes / Interests (comma separated)</label>
          <Textarea name="interests" value={formData.interests} onChange={handleChange} placeholder="Education, Environment, Health" className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
      </div>
    ),
  ];

  return (
    <StepContainer
      title="Volunteer Onboarding"
      step={step}
      totalSteps={steps.length}
      onNext={step === steps.length - 1 ? handleSubmit : nextStep}
      onPrev={prevStep}
      loading={loading}
    >
      {steps[step]}
    </StepContainer>
  );
}

// --- NGO Flow ---

function NGOFlow({ updateSession }: { updateSession: (data?: any) => Promise<any> }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    ngoName: "",
    registrationNumber: "",
    regDocsUrl: "",
    panId: "",
    description: "",
    logoUrl: "",
    galleryUrls: [],
    contactName: "",
    contactDesignation: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
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
          setFormData({ ...formData, [field]: json.url });
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboard/ngo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await updateSession({ role: "ngo_admin", isProfileComplete: true });
        router.push("/dashboard/ngo");
      } else {
        const errorData = await res.json();
        console.error("Onboarding failed:", res.status, res.statusText, errorData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-black">Organization Details</h3>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">NGO Name</label>
          <Input name="ngoName" value={formData.ngoName} onChange={handleChange} required className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Description / Mission</label>
          <Textarea name="description" value={formData.description} onChange={handleChange} required className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Logo</label>
          <Input type="file" onChange={(e) => handleFileUpload(e, "logoUrl")} className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 file:text-black file:font-bold" />
          {formData.logoUrl && <p className="text-xs text-lime-600 font-bold">Uploaded</p>}
        </div>
      </div>
    ),
    (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-black">Compliance & Documents</h3>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Registration Number</label>
          <Input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">PAN ID</label>
          <Input name="panId" value={formData.panId} onChange={handleChange} required className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Registration Document</label>
          <Input type="file" onChange={(e) => handleFileUpload(e, "regDocsUrl")} className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 file:text-black file:font-bold" />
          {formData.regDocsUrl && <p className="text-xs text-lime-600 font-bold">Uploaded</p>}
        </div>
      </div>
    ),
    (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-black">Admin Contact</h3>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Contact Person Name</label>
          <Input name="contactName" value={formData.contactName} onChange={handleChange} required className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-black">Designation</label>
          <Input name="contactDesignation" value={formData.contactDesignation} onChange={handleChange} required className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0" />
        </div>
      </div>
    ),
  ];

  return (
    <StepContainer
      title="NGO Onboarding"
      step={step}
      totalSteps={steps.length}
      onNext={step === steps.length - 1 ? handleSubmit : nextStep}
      onPrev={prevStep}
      loading={loading}
      formData={formData}
    >
      {steps[step]}
    </StepContainer>
  );
}

// --- Shared Components ---

function StepContainer({
  title,
  step,
  totalSteps,
  children,
  onNext,
  onPrev,
  loading,
  formData,
}: {
  title: string;
  step: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext: () => void;
  onPrev: () => void;
  loading: boolean;
  formData?: any;
}) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <Card className="w-full border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
      <CardHeader className="bg-lime-100 border-b-2 border-black">
        <CardTitle className="text-2xl font-black text-black tracking-tight">{title}</CardTitle>
        <div className="w-full bg-white h-3 rounded-full mt-4 border-2 border-black overflow-hidden">
          <div
            className="bg-lime-500 h-full transition-all duration-300 border-r-2 border-black"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <motion.div
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-[300px]"
        >
          {children}
        </motion.div>
        <div className="flex justify-between mt-8 pt-4 border-t-2 border-gray-100">
          <Button 
            variant="outline" 
            onClick={onPrev} 
            disabled={step === 0}
            className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-bold"
          >
            Back
          </Button>
          <Button 
            onClick={onNext} 
            disabled={loading || (step === 0 && (!formData.ngoName || !formData.description || !formData.logoUrl)) || (step === 1 && (!formData.registrationNumber || !formData.panId || !formData.regDocsUrl)) || (step === 2 && (!formData.contactName || !formData.contactDesignation))} 
            className="bg-black text-white hover:bg-gray-800 border-2 border-black shadow-[4px_4px_0px_0px_rgba(163,230,53,1)] hover:shadow-[2px_2px_0px_0px_rgba(163,230,53,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-bold"
          >
            {loading ? "Submitting..." : step === totalSteps - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
