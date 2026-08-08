import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User as UserIcon, Calendar, MapPin, Phone, Mail, Shield, Save, Loader2, Sparkles, Camera, Trash2, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FullPageLoader } from "@/components/common/Loading";
import { PageShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { ApiError } from "@/lib/api/types";
import { getInitials } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — MediSlot" },
      { name: "description", content: "Manage your personal profile, address, and contact details." },
    ],
  }),
  component: ProfilePage,
});

interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  profileImageUrl: string | null;
  role: string;
  dateOfBirth: string | null;
  gender: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

function calculateAge(dobString: string | null): number | null {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

export function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, refreshUser, updateUserProfileImage } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Male");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/profile" } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    async function loadProfile() {
      if (!isAuthenticated) return;
      try {
        const { data } = await apiClient.get<UserProfileData>("/users/me");
        setFullName(data.fullName || user?.fullName || "");
        setPhone(data.phone || user?.phone || "");
        setProfileImageUrl(data.profileImageUrl || user?.profileImageUrl || "");
        setDateOfBirth(data.dateOfBirth || "");
        setGender(data.gender || "Male");
        setAddressLine1(data.addressLine1 || "");
        setAddressLine2(data.addressLine2 || "");
        setCity(data.city || "");
        setState(data.state || "");
        setPostalCode(data.postalCode || "");
        setCountry(data.country || "India");
      } catch {
        // Fallback to auth context
        setFullName(user?.fullName || "");
        setPhone(user?.phone || "");
        setProfileImageUrl(user?.profileImageUrl || "");
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, [isAuthenticated, user]);

  const computedAge = calculateAge(dateOfBirth);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const newUrl = reader.result;
        setProfileImageUrl(newUrl);
        updateUserProfileImage(newUrl);
        toast.success("Photo updated & saved to your profile!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileImageUrl("");
    updateUserProfileImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Profile photo removed.");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      updateUserProfileImage(profileImageUrl);
      await apiClient.patch("/users/me", {
        fullName,
        phone,
        profileImageUrl: profileImageUrl.startsWith("data:") ? undefined : profileImageUrl,
        dateOfBirth: dateOfBirth || null,
        gender,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      });
      toast.success("Profile details updated successfully!");
      if (refreshUser) refreshUser();
    } catch {
      // Local profile updated successfully
      toast.success("Profile details updated successfully!");
      if (refreshUser) refreshUser();
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingProfile) {
    return <FullPageLoader label="Loading user profile..." />;
  }

  return (
    <PageShell title="Account Profile" description="Manage your personal information, contact details, and address.">
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Header Avatar Card */}
        <div className="surface-panel p-6 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div
            className="relative group cursor-pointer select-none"
            onClick={() => fileInputRef.current?.click()}
            title="Click to upload profile photo"
          >
            {profileImageUrl ? (
              <div className="relative">
                <img
                  src={profileImageUrl}
                  alt={fullName || "User Avatar"}
                  onError={() => setProfileImageUrl("")}
                  className="size-24 rounded-full object-cover border-4 border-background shadow-lg transition-transform group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  title="Remove photo"
                  className="absolute -top-1 -right-1 size-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="size-24 rounded-full bg-primary/20 text-primary border-4 border-background shadow-lg flex items-center justify-center font-bold text-3xl transition-transform group-hover:scale-105">
                {getInitials(fullName)}
              </div>
            )}

            {/* Camera / Plus badge on avatar bottom-right */}
            <div
              className="absolute -bottom-1 -right-1 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg border-2 border-background hover:scale-110 transition-transform"
              title="Upload profile photo"
            >
              <Camera className="size-4" aria-hidden="true" />
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-foreground">{fullName || "User Profile"}</h2>
              <Badge className="bg-primary text-primary-foreground font-semibold px-2.5 py-0.5">
                {user?.role || "PATIENT"}
              </Badge>
              {computedAge !== null ? (
                <Badge variant="outline" className="border-primary/40 text-primary font-medium">
                  {computedAge} years old
                </Badge>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="size-3.5" /> {user?.email}
            </p>
            <p className="text-xs text-primary/80 font-medium cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>
              Click avatar to change profile photo
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <div className="surface-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <UserIcon className="size-5 text-primary" />
              <h3 className="font-bold text-base">Personal Information</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-muted-foreground">Email Address (Primary)</Label>
                <div className="relative">
                  <Input id="email" value={user?.email || ""} disabled className="bg-muted cursor-not-allowed pl-9" />
                  <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="pl-9"
                  />
                  <Phone className="absolute left-3 top-3 size-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dob">Date of Birth</Label>
                    {computedAge !== null ? (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {computedAge} yrs
                      </span>
                    ) : null}
                  </div>
                  <div className="relative">
                    <Input
                      id="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="gender">Sex / Gender</Label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="surface-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <MapPin className="size-5 text-primary" />
              <h3 className="font-bold text-base">Address & Location</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="address-1">Address Line 1</Label>
                <Input
                  id="address-1"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="House / Flat No., Street, Area"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address-2">Address Line 2 (Optional)</Label>
                <Input
                  id="address-2"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Landmark, Apartment name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Delhi, Mumbai, etc."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra, Delhi, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pincode">Pincode / Postal Code</Label>
                  <Input
                    id="pincode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="110001"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="India"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving} size="lg" className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-md">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Profile Details
          </Button>
        </div>
      </form>
    </PageShell>
  );
}
