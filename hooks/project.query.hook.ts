import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Q_P_SEARCH_RESULT, Q_PROJECT, Q_PROJECTS } from "../apis/query-keys";
import { getProject, getProjects, searchProjects, updateProject } from "@/apis/client-side/projects-actions.api";
import { BaseProjectDto, CreateProjectDtoProjectTypeEnum, DetailedProjectDto, EditProjectDto, ProjectDto } from "@/api/src";

export const useProjects = (projectType?: CreateProjectDtoProjectTypeEnum) => {
  const { data: projects, refetch } = useQuery<ProjectDto[]>({
    queryKey: [Q_PROJECTS],
    queryFn: () => getProjects(),
  })
  return { projects: projectType ? projects?.filter(p => p.projectType === projectType) : projects, refetch }
}

export const useSearchedProjects = (projectType?: CreateProjectDtoProjectTypeEnum) => {
  const { data: pSearchResult, refetch } = useQuery<ProjectDto[]>({
    queryKey: [Q_P_SEARCH_RESULT],
    queryFn: () => getProjects(),
    enabled: false
  })
  return { pSearchResult: projectType ? pSearchResult?.filter(p => p.projectType === projectType) : pSearchResult, refetch }
}

export const useSearchProjects = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (searchMes: { projectName: string }) =>
      searchProjects(searchMes.projectName),

    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: async (data: BaseProjectDto[]) => {

      client.setQueryData([Q_P_SEARCH_RESULT], () => {
        const pro: ProjectDto[] | undefined = client.getQueryData([Q_PROJECTS])
        let filteredPro: ProjectDto[] | undefined
        if (pro) {
          filteredPro = pro.filter(p => data.some(d => d.name === p.name))
        }
        return filteredPro
      })
    },
    onError: (error => alert(error))
  })
}

export const useProject = (name: string, options: any) => {
  const { data: project, refetch, isLoading } = useQuery<DetailedProjectDto>({
    queryKey: [Q_PROJECT, name],
    queryFn: () => getProject(name),
    enabled: options?.enabled
  })
  return { project, refetch, isLoading }
}

export const useUpdateProject = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: ({ projectName, data }: { projectName: string, data: EditProjectDto }) =>
      updateProject(projectName, data),

    onSuccess: (data: BaseProjectDto, { projectName }: { projectName: string, data: EditProjectDto }) => {
      client.setQueryData([Q_PROJECT, projectName], (preData?: DetailedProjectDto) => {
        if (!preData) return preData;
        return { ...preData, ...data };
      });
    },
    onError: (error) => {
      console.error(error)
    }
  });
}

