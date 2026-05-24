import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBuild, updateBuild, deleteBuild, getMyBuilds,
  CreateBuildPayload, UpdateBuildPayload,
} from '@/lib/api/buildApi';
import api from '@/lib/api/axios';

export const buildKeys = {
  all: ['builds'] as const,
  mine: () => ['builds', 'mine'] as const,
  detail: (id: string) => ['builds', 'detail', id] as const,
  compatibility: (componentIds: Record<string, unknown>) => ['compatibility', componentIds] as const,
};

export function useMyBuilds() {
  return useQuery({
    queryKey: buildKeys.mine(),
    queryFn: getMyBuilds,
  });
}

export function useCreateBuild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBuildPayload) => createBuild(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buildKeys.mine() });
    },
  });
}

export function useUpdateBuild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBuildPayload }) =>
      updateBuild(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: buildKeys.mine() });
      queryClient.invalidateQueries({ queryKey: buildKeys.detail(data._id) });
    },
  });
}

export function useDeleteBuild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBuild(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buildKeys.mine() });
    },
  });
}

interface CompatibilityResult {
  issues: string[];
  warnings: string[];
}

async function checkCompatibility(body: Record<string, unknown>): Promise<CompatibilityResult> {
  const res = await api.post('/api/compatibility/check', body);
  if (res.data?.success) {
    return {
      issues: res.data.data?.issues ?? [],
      warnings: res.data.data?.warnings ?? [],
    };
  }
  return { issues: [], warnings: [] };
}

export function useCompatibilityCheck(componentIds: Record<string, unknown>, enabled: boolean) {
  return useQuery({
    queryKey: buildKeys.compatibility(componentIds),
    queryFn: () => checkCompatibility(componentIds),
    enabled,
    staleTime: 30_000,
  });
}
