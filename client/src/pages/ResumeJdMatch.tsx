import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useResume } from "@/hooks/use-resume";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  ThumbsUp, 
  BarChart2, 
  Key, 
  List, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle
} from "lucide-react";
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
type JdMatch = {
  id: number;
  resumeId: number;
  jobDescription: string;
  matchScore: number;
  missingKeywords: string[];
  suggestions: string[];
  createdAt: string;
};

// Form schema
const matchFormSchema = z.object({
  resumeId: z.string().min(1, "Please select a resume"),
  jobDescription: z.string().min(50, "Job description must be at least 50 characters"),
});

const ResumeJdMatch = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  
  // Temporary user ID for demo
  useEffect(() => {
    // In a real app, this would come from authentication state
    setUserId(1);
  }, []);

  // Use resume hook
  const {
    resumes,
    selectedResume,
    setSelectedResumeId,
    isLoading: isResumesLoading
  } = useResume(userId || undefined);

  // Form for job description input
  const form = useForm<z.infer<typeof matchFormSchema>>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      resumeId: "",
      jobDescription: "",
    },
  });

  // Query for resume JD matches by resume ID
  const { data: matches, isLoading: isMatchesLoading, refetch: refetchMatches } = useQuery<JdMatch[]>({
    queryKey: [selectedResume ? `/api/resume-jd-match/${selectedResume.id}` : null],
    enabled: !!selectedResume,
  });

  // Query for selected match
  const { data: selectedMatch, isLoading: isSelectedMatchLoading } = useQuery<JdMatch>({
    queryKey: [selectedMatchId ? `/api/resume-jd-match/${selectedMatchId}` : null],
    enabled: !!selectedMatchId,
  });

  // Create JD match mutation
  const { mutate: createMatch, isPending: isCreating } = useMutation({
    mutationFn: async (data: { resumeId: number; jobDescription: string }) => {
      const response = await apiRequest("POST", "/api/resume-jd-match", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Match analysis complete",
        description: "Your resume has been analyzed against the job description.",
      });
      refetchMatches();
      setSelectedMatchId(data.id);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to analyze match",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle resume selection change
  const handleResumeChange = (resumeId: string) => {
    setSelectedResumeId(parseInt(resumeId));
    setSelectedMatchId(null);
  };

  // Handle match selection
  const handleMatchSelect = (matchId: number) => {
    setSelectedMatchId(matchId);
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof matchFormSchema>) => {
    createMatch({
      resumeId: parseInt(data.resumeId),
      jobDescription: data.jobDescription,
    });
  };

  // Generate score color based on match percentage
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  // Generate progress color based on match percentage
  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resume to Job Description Match</h1>
          <p className="text-gray-600 mt-1">Analyze how well your resume matches specific job descriptions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Resume</CardTitle>
                <CardDescription>Choose a resume to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                {isResumesLoading ? (
                  <div className="py-4 text-center text-gray-500">Loading resumes...</div>
                ) : resumes && resumes.length > 0 ? (
                  <div>
                    <Select
                      onValueChange={handleResumeChange}
                      value={selectedResume?.id.toString()}
                    >
                      <SelectTrigger>
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
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes found</h3>
                    <p className="mt-1 text-sm text-gray-500">Create a resume first to use this feature.</p>
                    <div className="mt-6">
                      <Button onClick={() => window.location.href = "/resume-builder"}>
                        Create a Resume
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedResume && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Enter Job Description</CardTitle>
                    <CardDescription>Paste a job description to analyze</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="resumeId"
                          render={({ field }) => (
                            <FormItem className="hidden">
                              <FormControl>
                                <input {...field} value={selectedResume.id} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="jobDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Paste the job description here"
                                  rows={8}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={isCreating}>
                          {isCreating ? "Analyzing..." : "Analyze Match"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {matches && matches.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Previous Analyses</CardTitle>
                      <CardDescription>Your recent job match analyses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {matches.map((match) => (
                          <div
                            key={match.id}
                            className={`p-3 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100 ${
                              selectedMatchId === match.id ? "bg-primary-50 border border-primary-200" : "border"
                            }`}
                            onClick={() => handleMatchSelect(match.id)}
                          >
                            <div className="flex-1 truncate mr-2">
                              <div className="text-sm font-medium mb-1 truncate">
                                {match.jobDescription.substring(0, 30)}...
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(match.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className={`text-lg font-bold ${getScoreColor(match.matchScore)}`}>
                              {match.matchScore}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-2">
            {isSelectedMatchLoading ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart2 className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Loading analysis...</h3>
                  </div>
                </CardContent>
              </Card>
            ) : selectedMatch ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Match Analysis</CardTitle>
                    <CardDescription>
                      How well your resume matches this job description
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center mb-6">
                      <div className="text-5xl font-bold mb-2 flex items-center">
                        <span className={getScoreColor(selectedMatch.matchScore)}>
                          {selectedMatch.matchScore}%
                        </span>
                        <ThumbsUp className={`ml-4 h-8 w-8 ${selectedMatch.matchScore >= 70 ? 'text-green-500' : 'text-yellow-500'}`} />
                      </div>
                      <p className="text-gray-600 text-center max-w-md">
                        {selectedMatch.matchScore >= 85
                          ? "Excellent match! Your resume is well-aligned with this job description."
                          : selectedMatch.matchScore >= 70
                          ? "Good match. With a few adjustments, your resume can be perfect for this role."
                          : "Your resume needs significant improvements to match this job description."}
                      </p>
                    </div>

                    <div className="space-y-6 mt-8">
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <Key className="h-5 w-5 mr-2 text-primary-500" />
                          Missing Keywords
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          {selectedMatch.missingKeywords.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedMatch.missingKeywords.map((keyword, index) => (
                                <span key={index} className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-green-600 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Your resume includes all important keywords!
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <List className="h-5 w-5 mr-2 text-primary-500" />
                          Improvement Suggestions
                        </h3>
                        <div className="space-y-2">
                          {selectedMatch.suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start p-3 border rounded-md">
                              <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                              <p>{suggestion}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      Analysis date: {new Date(selectedMatch.createdAt).toLocaleString()}
                    </div>
                    <Button onClick={() => window.location.href = "/resume-builder"}>
                      Edit Resume
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                      {selectedMatch.jobDescription}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Analysis Selected</h3>
                    <p className="mt-1 text-gray-500 max-w-md mx-auto">
                      Select a resume and paste a job description to analyze how well they match.
                    </p>
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

export default ResumeJdMatch;
