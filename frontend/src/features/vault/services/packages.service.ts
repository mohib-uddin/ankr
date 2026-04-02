import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as packagesApi from '@/features/vault/api/packages.api';
import type { CreateUserPackagePayload, ValidatePackagePayload } from '@/features/vault/types/packages.types';

const packageTemplatesQueryKey = ['package-templates'] as const;
const userPackagesQueryKey = ['user-packages'] as const;
const documentCountsQueryKey = ['documents', 'counts'] as const;

export function usePackageTemplatesQuery() {
  return useQuery({
    queryKey: packageTemplatesQueryKey,
    queryFn: () => packagesApi.getPackageTemplates({ page: 1, limit: 200 }),
  });
}

export function useUserPackagesQuery() {
  return useQuery({
    queryKey: userPackagesQueryKey,
    queryFn: () => packagesApi.getUserPackages(),
  });
}

export function useUpsertUserPackageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPackagePayload) => packagesApi.upsertUserPackage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userPackagesQueryKey });
    },
  });
}

export function useDeleteUserPackageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => packagesApi.deleteUserPackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userPackagesQueryKey });
    },
  });
}

export function useValidateSharedPackageMutation() {
  return useMutation({
    mutationFn: (payload: ValidatePackagePayload) => packagesApi.validateSharedPackage(payload),
  });
}

export function useDocumentCountsQuery() {
  return useQuery({
    queryKey: documentCountsQueryKey,
    queryFn: () => packagesApi.getDocumentCounts(),
  });
}
