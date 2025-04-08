import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useResume } from "@/hooks/use-resume";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  BarChart2,
  Award
} from "lucide-react";

type ResumeScoreData = {
  id: number;
  resumeId: number;
  score: number;
  feedback: {
    category: string;
    score: number;
    suggestions: string[];
  }[];
  createdAt: string;
};

const ResumeScore = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<number | null>(null);
  
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

  // Query for resume score
  const { data: resumeScore, isLoading: isScoreLoading, refetch: refetchScore } = useQuery<ResumeScoreData>({
    queryKey: [selectedResume ? `/api/resume-score/${selectedResume.id}` : null],
    enabled: !!selectedResume,
  });

  // Convert feedback to chart data
  const chartData = resumeScore?.feedback.map(item => ({
    name: item.category,
    score: item.score,
    maxScore: 10
  })) || [];

  // Mutation for generating resume score
  const { mutate: generateScore, isPending: isGenerating } = useMutation({
    mutationFn: async (resumeId: number) => {
      const response = await apiRequest("POST", "/api/resume-score", { resumeId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Score generated",
        description: "Your resume has been analyzed and scored.",
      });
      refetchScore();
    },
    onError: (error) => {
      toast({
        title: "Failed to generate score",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle resume selection change
  const handleResumeChange = (resumeId: string) => {
    setSelectedResumeId(parseInt(resumeId));
  };

  // Handle generate score
  const handleGenerateScore = () => {
    if (!selectedResume) {
      toast({
        title: "No resume selected",
        description: "Please select a resume to score.",
        variant: "destructive",
      });
      return;
    }
    generateScore(selectedResume.id);
  };

  // Determine score color and text
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resume Score</h1>
          <p className="text-gray-600 mt-1">Get feedback on your resume and improve your chances of landing interviews</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select a Resume</CardTitle>
                <CardDescription>Choose a resume to analyze and score</CardDescription>
              </CardHeader>
              <CardContent>
                {isResumesLoading ? (
                  <div className="py-4 text-center text-gray-500">Loading resumes...</div>
                ) : resumes && resumes.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="resumeSelect">Your Resumes</Label>
                      <Select
                        onValueChange={handleResumeChange}
                        value={selectedResume?.id.toString()}
                      >
                        <SelectTrigger id="resumeSelect">
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
                    
                    {selectedResume && (
                      <div className="border rounded-lg p-4 mt-4">
                        <h3 className="font-medium mb-2">{selectedResume.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Last updated: {new Date(selectedResume.updatedAt).toLocaleDateString()}
                        </p>
                        <Button
                          onClick={handleGenerateScore}
                          disabled={isGenerating}
                          className="w-full"
                        >
                          {isGenerating ? "Analyzing..." : resumeScore ? "Regenerate Score" : "Analyze Resume"}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new resume.</p>
                    <div className="mt-6">
                      <Button onClick={() => window.location.href = "/resume-builder"}>
                        Create a Resume
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {resumeScore && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>ATS Compatibility</CardTitle>
                  <CardDescription>How well your resume works with Applicant Tracking Systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Keywords</span>
                      <span className="text-sm text-green-500">Good</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Formatting</span>
                      <span className="text-sm text-green-500">Good</span>
                    </div>
                    <Progress value={90} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Compatibility</span>
                      <span className="text-sm text-yellow-500">Fair</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="text-sm text-gray-500">
                    <CheckCircle className="inline-block h-4 w-4 mr-1 text-green-500" />
                    Your resume is ATS-friendly
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            {isScoreLoading ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart2 className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Loading resume score...</h3>
                  </div>
                </CardContent>
              </Card>
            ) : resumeScore ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Resume Score</CardTitle>
                    <CardDescription>Based on industry standards and best practices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <div className={`text-6xl font-bold ${getScoreColor(resumeScore.score)}`}>
                          {resumeScore.score}
                        </div>
                        <div className="absolute top-0 right-0 -mr-6 -mt-1">
                          <span className="text-xl text-gray-400">/100</span>
                        </div>
                      </div>
                      <div className={`text-lg font-medium mb-2 ${getScoreColor(resumeScore.score)}`}>
                        {getScoreText(resumeScore.score)}
                      </div>
                      <p className="text-gray-500 text-center">
                        Your resume is {resumeScore.score >= 70 ? "performing well" : "below average"} compared to other candidates in your industry.
                      </p>
                      
                      <div className="w-full mt-8">
                        <h3 className="text-lg font-medium mb-4">Score Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={chartData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="score" fill="#3b82f6" name="Your Score" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feedback & Suggestions</CardTitle>
                    <CardDescription>Areas where you can improve your resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {resumeScore.feedback.map((feedback, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{feedback.category}</h3>
                            <div className="flex items-center">
                              <span className={`mr-2 ${feedback.score >= 7 ? 'text-green-500' : feedback.score >= 5 ? 'text-yellow-500' : 'text-red-500'}`}>
                                {feedback.score}/10
                              </span>
                              {feedback.score >= 7 ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : feedback.score >= 5 ? (
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          </div>
                          <ul className="space-y-1 text-gray-600">
                            {feedback.suggestions.map((suggestion, i) => (
                              <li key={i} className="flex items-start">
                                <span className="inline-block mr-2">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                    <CardDescription>Recommended actions to improve your resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start">
                        <div className="bg-primary-100 p-2 rounded-full">
                          <Award className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Address feedback points</h3>
                          <p className="text-gray-600 text-sm">Update your resume based on the suggestions provided in the feedback section.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 items-start">
                        <div className="bg-primary-100 p-2 rounded-full">
                          <Award className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Tailor to job descriptions</h3>
                          <p className="text-gray-600 text-sm">Use our Resume JD Match tool to customize your resume for specific job postings.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 items-start">
                        <div className="bg-primary-100 p-2 rounded-full">
                          <Award className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Create a strong cover letter</h3>
                          <p className="text-gray-600 text-sm">Pair your improved resume with a compelling cover letter using our Cover Letter tool.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={() => window.location.href = "/resume-builder"}>
                      Edit Your Resume
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Score Available</h3>
                    <p className="mt-1 text-gray-500 max-w-md mx-auto">
                      Select a resume and click "Analyze Resume" to get detailed feedback and suggestions for improvement.
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

export default ResumeScore;
