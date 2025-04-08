import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useResume } from "@/hooks/use-resume";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Download, Save, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define schema for resume content
const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

const experienceSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().min(1, "Description is required"),
});

const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  graduationDate: z.string().min(1, "Graduation date is required"),
});

const resumeContentSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().min(1, "Summary is required"),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
});

// New resume form schema
const newResumeSchema = z.object({
  title: z.string().min(1, "Resume title is required"),
  templateId: z.string().min(1, "Please select a template"),
});

const ResumeBuilder = () => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [userId, setUserId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("template");
  const [showPreview, setShowPreview] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  
  // Determine if we're editing an existing resume or creating a new one
  const [isEditing, setIsEditing] = useState(false);
  
  // For new resume creation
  const [showNewResumeDialog, setShowNewResumeDialog] = useState(false);
  
  // Temporary user ID for demo
  useEffect(() => {
    // In a real app, this would come from authentication state
    setUserId(1);
  }, []);

  // Get templates
  const { data: templates } = useQuery<any[]>({
    queryKey: ['/api/templates'],
  });

  // Use resume hook
  const {
    resumes,
    selectedResume,
    setSelectedResumeId,
    createResume,
    updateResume,
    deleteResume,
    downloadResume,
    isLoading,
    isCreating
  } = useResume(userId || undefined);

  // Form for creating a new resume
  const newResumeForm = useForm<z.infer<typeof newResumeSchema>>({
    resolver: zodResolver(newResumeSchema),
    defaultValues: {
      title: "",
      templateId: "",
    },
  });

  // Form for resume content
  const resumeContentForm = useForm<z.infer<typeof resumeContentSchema>>({
    resolver: zodResolver(resumeContentSchema),
    defaultValues: {
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        website: "",
      },
      summary: "",
      experience: [
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          institution: "",
          degree: "",
          field: "",
          graduationDate: "",
        },
      ],
      skills: [],
    },
  });

  // Watch for changes to form values
  const formValues = resumeContentForm.watch();

  // Handle resume selection
  useEffect(() => {
    if (selectedResume) {
      resumeContentForm.reset({
        personalInfo: selectedResume.content.personalInfo,
        summary: selectedResume.content.summary,
        experience: selectedResume.content.experience,
        education: selectedResume.content.education,
        skills: selectedResume.content.skills,
      });
    }
  }, [selectedResume, resumeContentForm]);

  // Create a new resume
  const handleCreateNewResume = (data: z.infer<typeof newResumeSchema>) => {
    if (!userId) {
      toast({
        title: "Not logged in",
        description: "Please log in to create a resume",
        variant: "destructive",
      });
      return;
    }

    const emptyResumeContent = {
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        website: "",
      },
      summary: "",
      experience: [
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          institution: "",
          degree: "",
          field: "",
          graduationDate: "",
        },
      ],
      skills: [],
    };

    createResume({
      userId,
      title: data.title,
      templateId: data.templateId,
      content: emptyResumeContent,
    });

    setShowNewResumeDialog(false);
    setActiveTab("personal");
    setIsEditing(false);
  };

  // Save resume changes
  const handleSaveResume = () => {
    if (!selectedResume) {
      toast({
        title: "No resume selected",
        description: "Please create or select a resume first",
        variant: "destructive",
      });
      return;
    }

    const isValid = resumeContentForm.trigger();
    if (!isValid) {
      toast({
        title: "Invalid data",
        description: "Please fix the errors before saving",
        variant: "destructive",
      });
      return;
    }

    const updatedContent = resumeContentForm.getValues();
    updateResume({
      id: selectedResume.id,
      data: {
        content: updatedContent,
      },
    });
  };

  // Add a new experience item
  const addExperience = () => {
    const currentExperience = resumeContentForm.getValues().experience || [];
    resumeContentForm.setValue("experience", [
      ...currentExperience,
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  // Add a new education item
  const addEducation = () => {
    const currentEducation = resumeContentForm.getValues().education || [];
    resumeContentForm.setValue("education", [
      ...currentEducation,
      {
        institution: "",
        degree: "",
        field: "",
        graduationDate: "",
      },
    ]);
  };

  // Remove an experience item
  const removeExperience = (index: number) => {
    const currentExperience = resumeContentForm.getValues().experience || [];
    resumeContentForm.setValue(
      "experience",
      currentExperience.filter((_, i) => i !== index)
    );
  };

  // Remove an education item
  const removeEducation = (index: number) => {
    const currentEducation = resumeContentForm.getValues().education || [];
    resumeContentForm.setValue(
      "education",
      currentEducation.filter((_, i) => i !== index)
    );
  };

  // Add a skill
  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const currentSkills = resumeContentForm.getValues().skills || [];
    if (!currentSkills.includes(newSkill.trim())) {
      resumeContentForm.setValue("skills", [...currentSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  // Remove a skill
  const removeSkill = (skill: string) => {
    const currentSkills = resumeContentForm.getValues().skills || [];
    resumeContentForm.setValue(
      "skills",
      currentSkills.filter((s) => s !== skill)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-gray-600 mt-1">Create and customize your professional resume</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Dialog open={showNewResumeDialog} onOpenChange={setShowNewResumeDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">New Resume</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Resume</DialogTitle>
                </DialogHeader>
                <Form {...newResumeForm}>
                  <form onSubmit={newResumeForm.handleSubmit(handleCreateNewResume)} className="space-y-4 py-4">
                    <FormField
                      control={newResumeForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resume Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Software Developer Resume" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newResumeForm.control}
                      name="templateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Template</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a template" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {templates?.map((template) => (
                                <SelectItem key={template.id} value={template.id.toString()}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create Resume"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {selectedResume && (
              <>
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? "Edit" : "Preview"}
                </Button>
                <Button variant="outline" onClick={() => downloadResume("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" onClick={() => downloadResume("docx")}>
                  <Download className="h-4 w-4 mr-2" />
                  DOCX
                </Button>
                <Button onClick={handleSaveResume}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        {resumes && resumes.length > 0 && (
          <div className="mb-6">
            <Label htmlFor="resumeSelect">Select a resume to edit</Label>
            <div className="flex gap-2 mt-1">
              <Select
                onValueChange={(value) => setSelectedResumeId(parseInt(value))}
                value={selectedResume?.id.toString()}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id.toString()}>
                      {resume.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedResume && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this resume?")) {
                      deleteResume(selectedResume.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {selectedResume ? (
          <>
            {showPreview ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-white p-8 rounded-lg shadow border">
                    <h2 className="text-2xl font-bold text-center mb-4">{formValues.personalInfo.name}</h2>
                    <div className="text-center text-sm text-gray-600 mb-6">
                      {formValues.personalInfo.email} • {formValues.personalInfo.phone}
                      {formValues.personalInfo.address && <> • {formValues.personalInfo.address}</>}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {formValues.summary && (
                      <>
                        <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
                        <p className="mb-4">{formValues.summary}</p>
                        <Separator className="my-4" />
                      </>
                    )}
                    
                    {formValues.experience && formValues.experience.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold mb-2">Experience</h3>
                        {formValues.experience.map((exp, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between">
                              <div>
                                <div className="font-medium">{exp.title}</div>
                                <div>{exp.company}</div>
                              </div>
                              <div className="text-sm text-gray-600">
                                {exp.startDate} - {exp.endDate}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">{exp.location}</div>
                            <p className="text-sm">{exp.description}</p>
                          </div>
                        ))}
                        <Separator className="my-4" />
                      </>
                    )}
                    
                    {formValues.education && formValues.education.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold mb-2">Education</h3>
                        {formValues.education.map((edu, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between">
                              <div>
                                <div className="font-medium">{edu.degree} in {edu.field}</div>
                                <div>{edu.institution}</div>
                              </div>
                              <div className="text-sm text-gray-600">
                                {edu.graduationDate}
                              </div>
                            </div>
                          </div>
                        ))}
                        <Separator className="my-4" />
                      </>
                    )}
                    
                    {formValues.skills && formValues.skills.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {formValues.skills.map((skill, index) => (
                            <span key={index} className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-5 mb-6">
                    <TabsTrigger value="template">Template</TabsTrigger>
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="template" className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Select a Template</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {templates?.map((template) => (
                        <div
                          key={template.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedResume.templateId === template.id.toString()
                              ? "border-primary-500 bg-primary-50"
                              : "hover:border-gray-400"
                          }`}
                          onClick={() => {
                            updateResume({
                              id: selectedResume.id,
                              data: { templateId: template.id.toString() },
                            });
                          }}
                        >
                          <div className="h-40 bg-gray-100 flex items-center justify-center mb-2 rounded">
                            <span className="text-gray-600">{template.name}</span>
                          </div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="personal" className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            {...resumeContentForm.register("personalInfo.name")}
                            placeholder="John Doe"
                          />
                          {resumeContentForm.formState.errors.personalInfo?.name && (
                            <p className="text-sm text-red-500">
                              {resumeContentForm.formState.errors.personalInfo.name.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            {...resumeContentForm.register("personalInfo.email")}
                            placeholder="john.doe@example.com"
                          />
                          {resumeContentForm.formState.errors.personalInfo?.email && (
                            <p className="text-sm text-red-500">
                              {resumeContentForm.formState.errors.personalInfo.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            {...resumeContentForm.register("personalInfo.phone")}
                            placeholder="(123) 456-7890"
                          />
                          {resumeContentForm.formState.errors.personalInfo?.phone && (
                            <p className="text-sm text-red-500">
                              {resumeContentForm.formState.errors.personalInfo.phone.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="address">Address (Optional)</Label>
                          <Input
                            id="address"
                            {...resumeContentForm.register("personalInfo.address")}
                            placeholder="City, State"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
                          <Input
                            id="linkedin"
                            {...resumeContentForm.register("personalInfo.linkedin")}
                            placeholder="linkedin.com/in/johndoe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Personal Website (Optional)</Label>
                          <Input
                            id="website"
                            {...resumeContentForm.register("personalInfo.website")}
                            placeholder="johndoe.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                          id="summary"
                          {...resumeContentForm.register("summary")}
                          placeholder="Write a brief summary highlighting your skills and experience"
                          rows={4}
                        />
                        {resumeContentForm.formState.errors.summary && (
                          <p className="text-sm text-red-500">
                            {resumeContentForm.formState.errors.summary.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="experience" className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Work Experience</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                    
                    {formValues.experience?.map((_, index) => (
                      <div key={index} className="mb-6 p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Experience {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`experience.${index}.title`}>Job Title</Label>
                              <Input
                                id={`experience.${index}.title`}
                                {...resumeContentForm.register(`experience.${index}.title`)}
                                placeholder="Software Developer"
                              />
                              {resumeContentForm.formState.errors.experience?.[index]?.title && (
                                <p className="text-sm text-red-500">
                                  {resumeContentForm.formState.errors.experience[index]?.title?.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`experience.${index}.company`}>Company</Label>
                              <Input
                                id={`experience.${index}.company`}
                                {...resumeContentForm.register(`experience.${index}.company`)}
                                placeholder="ABC Company"
                              />
                              {resumeContentForm.formState.errors.experience?.[index]?.company && (
                                <p className="text-sm text-red-500">
                                  {resumeContentForm.formState.errors.experience[index]?.company?.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor={`experience.${index}.location`}>Location (Optional)</Label>
                              <Input
                                id={`experience.${index}.location`}
                                {...resumeContentForm.register(`experience.${index}.location`)}
                                placeholder="City, Country"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`experience.${index}.startDate`}>Start Date</Label>
                              <Input
                                id={`experience.${index}.startDate`}
                                {...resumeContentForm.register(`experience.${index}.startDate`)}
                                placeholder="Jan 2020"
                              />
                              {resumeContentForm.formState.errors.experience?.[index]?.startDate && (
                                <p className="text-sm text-red-500">
                                  {resumeContentForm.formState.errors.experience[index]?.startDate?.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`experience.${index}.endDate`}>End Date</Label>
                              <Input
                                id={`experience.${index}.endDate`}
                                {...resumeContentForm.register(`experience.${index}.endDate`)}
                                placeholder="Present"
                              />
                              {resumeContentForm.formState.errors.experience?.[index]?.endDate && (
                                <p className="text-sm text-red-500">
                                  {resumeContentForm.formState.errors.experience[index]?.endDate?.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`experience.${index}.description`}>Description</Label>
                            <Textarea
                              id={`experience.${index}.description`}
                              {...resumeContentForm.register(`experience.${index}.description`)}
                              placeholder="Describe your responsibilities and achievements"
                              rows={4}
                            />
                            {resumeContentForm.formState.errors.experience?.[index]?.description && (
                              <p className="text-sm text-red-500">
                                {resumeContentForm.formState.errors.experience[index]?.description?.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="education" className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Education</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                    
                    {formValues.education?.map((_, index) => (
                      <div key={index} className="mb-6 p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Education {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`education.${index}.institution`}>Institution</Label>
                              <Input
                                id={`education.${index}.institution`}
                                {...resumeContentForm.register(`education.${index}.institution`)}
                                placeholder="University of Example"
                              />
                              {resumeContentForm.formState.errors.education?.[index]?.institution && (
                                <p className="text-sm text-red-500">
                                  {resumeContentForm.formState.errors.education[index]?.institution?.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`education.${index}.graduationDate`}>Graduation Date</Label>
                              <Input
                                id={`education.${index}.graduationDate`}
                                {...resumeContentForm.register(`education.${index}.graduationDate`)}
                                placeholder="May 2020"
                              />
                              {resumeContentForm.formState.errors.education?.[index]?.graduationDate && (
                                <p className="text-sm text-red-500">
                                  {resumeContentForm.formState.errors.education[index]?.graduationDate?.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`education.${index}.degree`}>Degree</Label>
                              <Input
                                id={`education.${index}.degree`}
                                {...resumeContentForm.register(`education.${index}.degree`)}
                                placeholder="Bachelor of Science"
                              />
                              {resumeContentForm.formState.errors.education?.[index]?.degree && (
                                <p className="text-sm text-red-500">
                                  {resumeContentForm.formState.errors.education[index]?.degree?.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`education.${index}.field`}>Field of Study</Label>
                              <Input
                                id={`education.${index}.field`}
                                {...resumeContentForm.register(`education.${index}.field`)}
                                placeholder="Computer Science"
                              />
                              {resumeContentForm.formState.errors.education?.[index]?.field && (
                                <p className="text-sm text-red-500">
                                  {resumeContentForm.formState.errors.education[index]?.field?.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="skills" className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Skills</h3>
                    
                    <div className="mb-4">
                      <Label htmlFor="newSkill">Add a Skill</Label>
                      <div className="flex gap-2">
                        <Input
                          id="newSkill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="e.g. JavaScript, Project Management"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                        />
                        <Button type="button" onClick={addSkill}>Add</Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formValues.skills?.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm flex items-center"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-primary-500 hover:text-primary-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Create your first resume</h3>
                <p className="text-gray-500 mb-6">Get started by creating a new resume or selecting an existing one.</p>
                <Button onClick={() => setShowNewResumeDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
