import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useResume } from "@/hooks/use-resume";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  PlusCircle, 
  Download, 
  Save, 
  Trash2, 
  Edit, 
  FileCode,
  Wand2
} from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Types
interface CoverLetter {
  id: number;
  userId: number;
  title: string;
  content: string;
  jobDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Form schema
const coverLetterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  jobDescription: z.string().optional(),
});

const generateSchema = z.object({
  resumeId: z.string().min(1, "Please select a resume"),
  jobDescription: z.string().min(50, "Job description must be at least 50 characters"),
  title: z.string().min(1, "Title is required"),
});

const CoverLetter = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<number | null>(null);
  const [showNewLetterDialog, setShowNewLetterDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  
  // Temporary user ID for demo
  useEffect(() => {
    // In a real app, this would come from authentication state
    setUserId(1);
  }, []);

  // Fetch user's resumes
  const { resumes } = useResume(userId || undefined);

  // Fetch user's cover letters
  const { data: coverLetters, isLoading: isLoadingCoverLetters } = useQuery<CoverLetter[]>({
    queryKey: [userId ? `/api/cover-letters/user/${userId}` : null],
    enabled: !!userId,
  });

  // Fetch selected cover letter
  const { data: selectedCoverLetter, isLoading: isLoadingSelected } = useQuery<CoverLetter>({
    queryKey: [selectedCoverLetterId ? `/api/cover-letters/${selectedCoverLetterId}` : null],
    enabled: !!selectedCoverLetterId,
  });

  // Cover letter form
  const coverLetterForm = useForm<z.infer<typeof coverLetterSchema>>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      title: "",
      content: "",
      jobDescription: "",
    },
  });

  // Generate form
  const generateForm = useForm<z.infer<typeof generateSchema>>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      resumeId: "",
      jobDescription: "",
      title: "",
    },
  });

  // Update form when selected cover letter changes
  useEffect(() => {
    if (selectedCoverLetter) {
      coverLetterForm.reset({
        title: selectedCoverLetter.title,
        content: selectedCoverLetter.content,
        jobDescription: selectedCoverLetter.jobDescription || "",
      });
    } else {
      coverLetterForm.reset({
        title: "",
        content: "",
        jobDescription: "",
      });
    }
  }, [selectedCoverLetter, coverLetterForm]);

  // Create cover letter mutation
  const { mutate: createCoverLetter, isPending: isCreating } = useMutation({
    mutationFn: async (data: { userId: number; title: string; content: string; jobDescription?: string }) => {
      const response = await apiRequest("POST", "/api/cover-letters", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/cover-letters/user/${userId}`] });
      toast({
        title: "Cover letter created",
        description: "Your cover letter has been created successfully.",
      });
      setSelectedCoverLetterId(data.id);
      setShowNewLetterDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create cover letter",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update cover letter mutation
  const { mutate: updateCoverLetter, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { title?: string; content?: string; jobDescription?: string };
    }) => {
      const response = await apiRequest("PUT", `/api/cover-letters/${id}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/cover-letters/${data.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/cover-letters/user/${userId}`] });
      toast({
        title: "Cover letter updated",
        description: "Your cover letter has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update cover letter",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete cover letter mutation
  const { mutate: deleteCoverLetter, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/cover-letters/${id}`, undefined);
      return response.json();
    },
    onSuccess: (_data, variables) => {
      const deletedLetterId = variables;
      queryClient.invalidateQueries({ queryKey: [`/api/cover-letters/user/${userId}`] });
      
      if (selectedCoverLetterId === deletedLetterId) {
        setSelectedCoverLetterId(null);
      }
      
      toast({
        title: "Cover letter deleted",
        description: "Your cover letter has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete cover letter",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate cover letter mutation
  const { mutate: generateCoverLetter, isPending: isGenerating } = useMutation({
    mutationFn: async (data: { resumeId: number; jobDescription: string; title: string }) => {
      // Simulate AI generation with a placeholder (in a real app, this would call the backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Placeholder data
      return {
        userId: userId,
        title: data.title,
        content: 
`Dear Hiring Manager,

I am writing to express my interest in the position at your company. I came across this opportunity on your website and was immediately drawn to it because it aligns perfectly with my skills and career goals.

Based on the job description, I understand you're looking for someone with experience in this field. Throughout my career, I've developed strong skills in problem-solving, communication, and teamwork. In my previous role, I successfully led projects that increased efficiency and reduced costs.

My resume details my qualifications, but I'd like to highlight my passion for this industry and my dedication to producing high-quality work. I'm particularly excited about the possibility of contributing to your team and helping achieve your company's objectives.

I welcome the opportunity to discuss how my background, skills, and experiences would be a good match for this position. Thank you for considering my application.

Sincerely,
[Your Name]`,
        jobDescription: data.jobDescription
      };
    },
    onSuccess: (data) => {
      // In a real app, this would save the generated cover letter to the backend
      if (userId) {
        createCoverLetter({
          userId,
          title: data.title,
          content: data.content,
          jobDescription: data.jobDescription
        });
      }
      setShowGenerateDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate cover letter",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle new cover letter form submission
  const handleCreateCoverLetter = (data: z.infer<typeof coverLetterSchema>) => {
    if (!userId) {
      toast({
        title: "Not logged in",
        description: "Please log in to create a cover letter",
        variant: "destructive",
      });
      return;
    }

    createCoverLetter({
      userId,
      title: data.title,
      content: data.content,
      jobDescription: data.jobDescription,
    });
  };

  // Handle cover letter save
  const handleSaveCoverLetter = () => {
    if (!selectedCoverLetterId) {
      toast({
        title: "No cover letter selected",
        description: "Please create or select a cover letter first",
        variant: "destructive",
      });
      return;
    }

    const isValid = coverLetterForm.trigger();
    if (!isValid) {
      toast({
        title: "Invalid data",
        description: "Please fix the errors before saving",
        variant: "destructive",
      });
      return;
    }

    const data = coverLetterForm.getValues();
    updateCoverLetter({
      id: selectedCoverLetterId,
      data: {
        title: data.title,
        content: data.content,
        jobDescription: data.jobDescription,
      },
    });
  };

  // Handle generate cover letter form submission
  const handleGenerateCoverLetter = (data: z.infer<typeof generateSchema>) => {
    generateCoverLetter({
      resumeId: parseInt(data.resumeId),
      jobDescription: data.jobDescription,
      title: data.title
    });
  };

  // Simple download function (in a real app, this would generate a file)
  const handleDownload = () => {
    if (!selectedCoverLetter) {
      toast({
        title: "No cover letter selected",
        description: "Please create or select a cover letter first",
        variant: "destructive",
      });
      return;
    }

    // Create a text blob and download it
    const blob = new Blob([selectedCoverLetter.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedCoverLetter.title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Cover letter downloaded",
      description: "Your cover letter has been downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cover Letter Generator</h1>
            <p className="text-gray-600 mt-1">Create personalized cover letters for your job applications</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Dialog open={showNewLetterDialog} onOpenChange={setShowNewLetterDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Letter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Cover Letter</DialogTitle>
                </DialogHeader>
                <Form {...coverLetterForm}>
                  <form onSubmit={coverLetterForm.handleSubmit(handleCreateCoverLetter)} className="space-y-4 py-4">
                    <FormField
                      control={coverLetterForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Software Developer Cover Letter" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={coverLeterForm.control}
                      name="jobDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste the job description here to reference later"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={coverLetterForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write your cover letter here"
                              rows={8}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create Letter"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Letter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Generate Cover Letter</DialogTitle>
                </DialogHeader>
                <Form {...generateForm}>
                  <form onSubmit={generateForm.handleSubmit(handleGenerateCoverLetter)} className="space-y-4 py-4">
                    <FormField
                      control={generateForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Letter Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Application for Marketing Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generateForm.control}
                      name="resumeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Resume</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a resume to base your letter on" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {resumes?.map((resume) => (
                                <SelectItem key={resume.id} value={resume.id.toString()}>
                                  {resume.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generateForm.control}
                      name="jobDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste the full job description here"
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isGenerating}>
                        {isGenerating ? "Generating..." : "Generate Cover Letter"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {selectedCoverLetterId && (
              <>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={handleSaveCoverLetter}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Cover Letters</CardTitle>
                <CardDescription>Select a letter to edit</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCoverLetters ? (
                  <div className="py-4 text-center text-gray-500">Loading...</div>
                ) : coverLetters && coverLetters.length > 0 ? (
                  <div className="space-y-2">
                    {coverLetters.map((letter) => (
                      <div
                        key={letter.id}
                        className={`p-3 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100 ${
                          selectedCoverLetterId === letter.id ? "bg-primary-50 border border-primary-200" : "border"
                        }`}
                        onClick={() => setSelectedCoverLetterId(letter.id)}
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium truncate max-w-[140px]">{letter.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Are you sure you want to delete this cover letter?")) {
                              deleteCoverLetter(letter.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <FileCode className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No cover letters</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new cover letter.</p>
                    <div className="mt-6">
                      <Button onClick={() => setShowNewLetterDialog(true)}>
                        Create Letter
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            {isLoadingSelected ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Loading cover letter...</h3>
                  </div>
                </CardContent>
              </Card>
            ) : selectedCoverLetter ? (
              <Card>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{selectedCoverLetter.title}</CardTitle>
                      <CardDescription>Created on {new Date(selectedCoverLetter.createdAt).toLocaleDateString()}</CardDescription>
                    </div>
                    <TabsList>
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      {selectedCoverLetter.jobDescription && (
                        <TabsTrigger value="jobDescription">Job Description</TabsTrigger>
                      )}
                    </TabsList>
                  </CardHeader>
                  <CardContent>
                    <TabsContent value="editor" className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          {...coverLetterForm.register("title")}
                          className="mt-1"
                        />
                        {coverLetterForm.formState.errors.title && (
                          <p className="text-sm text-red-500 mt-1">
                            {coverLetterForm.formState.errors.title.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          {...coverLetterForm.register("content")}
                          className="mt-1 font-mono"
                          rows={16}
                        />
                        {coverLetterForm.formState.errors.content && (
                          <p className="text-sm text-red-500 mt-1">
                            {coverLetterForm.formState.errors.content.message}
                          </p>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="bg-white p-8 rounded border min-h-[400px] whitespace-pre-line font-serif">
                        {selectedCoverLetter.content}
                      </div>
                    </TabsContent>
                    {selectedCoverLetter.jobDescription && (
                      <TabsContent value="jobDescription">
                        <div className="bg-gray-50 p-6 rounded border min-h-[400px] whitespace-pre-line">
                          <h3 className="text-xl font-medium mb-4">Job Description</h3>
                          {selectedCoverLetter.jobDescription}
                        </div>
                      </TabsContent>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Label htmlFor="jobDescription" className="text-sm text-gray-500">
                      Last updated: {new Date(selectedCoverLetter.updatedAt).toLocaleString()}
                    </Label>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button onClick={handleSaveCoverLetter} disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </CardFooter>
                </Tabs>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Cover Letter Selected</h3>
                    <p className="mt-1 text-gray-500 max-w-md mx-auto">
                      Select a cover letter from the sidebar to edit, or create a new one.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="outline" onClick={() => setShowNewLetterDialog(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Create Manually
                      </Button>
                      <Button onClick={() => setShowGenerateDialog(true)}>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate with AI
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;
