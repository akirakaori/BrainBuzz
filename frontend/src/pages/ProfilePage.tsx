import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { profileApi, ApiError } from "../utils/api";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  skills: string;
}

interface FormData extends UserProfile {
  config: {
    mode: "view" | "edit";
  };
}

function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const defaultValues: FormData = {
    name: "",
    bio: "",
    email: "",
    skills: "",
    config: {
      mode: "view",
    },
  };

  const methods = useForm({ defaultValues });
  const { watch, reset, setValue, register, handleSubmit, formState: { errors } } = methods;

  useEffect(() => {
    // Fetch user profile from backend API
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        
        // Check if token exists
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setNotification({
            type: "error",
            message: "Please log in to view your profile"
          });
          return;
        }

        // Call the backend API using our utility
        const data = await profileApi.getMyProfile();
        
        if (data.message === "Profile retrieved successfully" && data.user) {
          const profileData: FormData = {
            name: data.user.name || "",
            email: data.user.email || "",
            bio: data.user.bio || "",
            skills: data.user.skills || "",
            config: {
              mode: "view",
            },
          };
          reset(profileData);
        } else {
          throw new ApiError(data.message || "Failed to fetch profile", 400);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        
        if (error instanceof ApiError) {
          if (error.status === 401) {
            setNotification({
              type: "error",
              message: "Session expired. Please log in again."
            });
            // Optionally redirect to login
            // window.location.href = '/login';
          } else {
            setNotification({
              type: "error",
              message: error.message
            });
          }
        } else {
          setNotification({
            type: "error",
            message: "Failed to load profile. Please try again."
          });
        }
        
        // Fallback to demo data if API fails
        const fallbackData: FormData = {
          name: "Demo User",
          bio: "Please update your profile information",
          email: "user@example.com",
          skills: "",
          config: {
            mode: "view",
          },
        };
        reset(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [reset]);

  const data = watch();

  const onClickEdit = () => {
    setValue("config.mode", "edit");
    setNotification(null);
  };

  const onCancel = () => {
    setValue("config.mode", "view");
    // Reset form to original values by refetching current state
    const currentData = watch();
    reset({
      name: currentData.name,
      email: currentData.email,
      bio: currentData.bio,
      skills: currentData.skills,
      config: { mode: "view" }
    });
    setNotification(null);
  };

  const onSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setNotification(null);

      // Check if token exists
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setNotification({
          type: "error",
          message: "Please log in to update your profile"
        });
        return;
      }

      // Prepare data for API (exclude config)
      const { config, ...profileData } = formData;
      
      // Call the backend API using our utility
      const data = await profileApi.updateMyProfile(profileData);
      
      if (data.message === "Profile updated successfully" && data.user) {
        // Update the form with the returned data
        const updatedFormData: FormData = {
          name: data.user.name,
          email: data.user.email,
          bio: data.user.bio,
          skills: data.user.skills,
          config: {
            mode: "view",
          },
        };
        reset(updatedFormData);
        
        setValue("config.mode", "view");
        setNotification({
          type: "success",
          message: "Profile updated successfully!"
        });
        
        // Auto-hide notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      } else {
        throw new ApiError(data.message || "Failed to update profile", 400);
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setNotification({
            type: "error",
            message: "Session expired. Please log in again."
          });
        } else if (error.status === 400) {
          setNotification({
            type: "error",
            message: error.message
          });
        } else {
          setNotification({
            type: "error",
            message: "Failed to update profile. Please try again."
          });
        }
      } else {
        setNotification({
          type: "error",
          message: "Network error. Please check your connection and try again."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !data.name) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-header-content">
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">Manage your personal information and preferences</p>
          </div>
          {data?.config?.mode === "view" && (
            <button 
              className="btn btn-primary profile-edit-btn"
              onClick={onClickEdit}
              disabled={isLoading}
            >
              <span className="btn-icon">✏️</span>
              Edit Profile
            </button>
          )}
        </div>

        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            <div className="notification-content">
              <span className="notification-icon">
                {notification.type === "success" ? "✅" : "❌"}
              </span>
              <span className="notification-message">{notification.message}</span>
            </div>
            <button 
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Profile Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
          <div className="profile-card">
            {data?.config?.mode === "view" ? (
              /* View Mode */
              <div className="profile-view">
                <div className="profile-avatar-section">
                  <div className="profile-avatar">
                    <span className="avatar-text">
                      {data.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="profile-basic-info">
                    <h2 className="profile-name">{data.name}</h2>
                    <p className="profile-email">{data.email}</p>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-section">
                    <h3 className="detail-label">About Me</h3>
                    <p className="detail-content bio-content">
                      {data.bio || "No bio available"}
                    </p>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-label">Skills & Expertise</h3>
                    <div className="skills-container">
                      {data.skills ? data.skills.split(',').map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill.trim()}
                        </span>
                      )) : (
                        <p className="detail-content">No skills listed</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <div className="profile-edit">
                <h2 className="edit-title">Edit Profile Information</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Full Name *
                    </label>
                    <input
                      {...register("name", { 
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" }
                      })}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Enter your full name"
                      id="name"
                    />
                    {errors.name && (
                      <span className="error-message">{errors.name.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email Address *
                    </label>
                    <input
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email address"
                      type="email"
                      id="email"
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email.message}</span>
                    )}
                  </div>

                  <div className="form-group form-group-full">
                    <label className="form-label" htmlFor="bio">
                      Bio
                    </label>
                    <textarea
                      {...register("bio")}
                      className="form-textarea"
                      placeholder="Tell us about yourself..."
                      rows={4}
                      id="bio"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label className="form-label" htmlFor="skills">
                      Skills (comma-separated)
                    </label>
                    <input
                      {...register("skills")}
                      className="form-input"
                      placeholder="e.g. React, Node.js, TypeScript, MongoDB"
                      id="skills"
                    />
                    <small className="form-help">
                      Separate multiple skills with commas
                    </small>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner small"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">💾</span>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
