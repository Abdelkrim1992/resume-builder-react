import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generatePDF, generateDOCX } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";

interface ResumeContent {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  skills: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
}

interface Resume {
  id: number;
  userId: number;
  title: string;
  content: ResumeContent;
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

export function useResume(userId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  const { data: resumes, isLoading: isLoadingResumes } = useQuery<Resume[]>({
    queryKey: [userId ? `/api/resumes/user/${userId}` : null],
    enabled: !!userId
  });

  const { data: selectedResume, isLoading: isLoadingSelectedResume } = useQuery<Resume>({
    queryKey: [selectedResumeId ? `/api/resumes/${selectedResumeId}` : null],
    enabled: !!selectedResumeId
  });

  const { mutate: createResume, isPending: isCreating } = useMutation({
    mutationFn: async (data: { userId: number; title: string; content: ResumeContent; templateId: string }) => {
      const response = await apiRequest("POST", "/api/resumes", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/resumes/user/${data.userId}`] });
      toast({
        title: "Resume created",
        description: "Your resume has been created successfully."
      });
      setSelectedResumeId(data.id);
    },
    onError: (error) => {
      toast({
        title: "Failed to create resume",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const { mutate: updateResume, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<{ title: string; content: ResumeContent; templateId: string }> }) => {
      const response = await apiRequest("PUT", `/api/resumes/${id}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/resumes/${data.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/resumes/user/${data.userId}`] });
      toast({
        title: "Resume updated",
        description: "Your resume has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update resume",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteResume, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/resumes/${id}`, undefined);
      return response.json();
    },
    onSuccess: (_data, variables) => {
      const deletedResumeId = variables;
      const currentResume = queryClient.getQueryData<Resume>([`/api/resumes/${deletedResumeId}`]);
      
      if (currentResume) {
        queryClient.invalidateQueries({ queryKey: [`/api/resumes/user/${currentResume.userId}`] });
      }
      
      if (selectedResumeId === deletedResumeId) {
        setSelectedResumeId(null);
      }
      
      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete resume",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const downloadResume = async (format: 'pdf' | 'docx') => {
    if (!selectedResume) {
      toast({
        title: "No resume selected",
        description: "Please select a resume to download.",
        variant: "destructive"
      });
      return;
    }

    try {
      let dataUrl: string;
      
      if (format === 'pdf') {
        dataUrl = await generatePDF(selectedResume);
      } else {
        dataUrl = await generateDOCX(selectedResume);
      }
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${selectedResume.title}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: `Resume downloaded as ${format.toUpperCase()}`,
        description: "Your resume has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: `Failed to download resume as ${format.toUpperCase()}`,
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return {
    resumes,
    selectedResume,
    setSelectedResumeId,
    createResume,
    updateResume,
    deleteResume,
    downloadResume,
    isLoading: isLoadingResumes || isLoadingSelectedResume,
    isCreating,
    isUpdating,
    isDeleting
  };
}
