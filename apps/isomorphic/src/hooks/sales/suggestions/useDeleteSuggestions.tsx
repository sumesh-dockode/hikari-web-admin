'use client';
import { API_ROUTES } from '@/app/lib/api';
import apiClient from '@/app/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useDeleteSuggestions() {
  const { data: session } = useSession();

  const deleteSuggestions = async (suggestionId: any): Promise<void> => {
    if (!session) throw new Error('Session not found');
    let url = `${API_ROUTES.suggestions}${suggestionId}/`;
    const { data } = await apiClient.delete(url);
    return data;
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (suggestionId: number) => deleteSuggestions(suggestionId),
    onSuccess: (_, suggestionId) => {
      queryClient.invalidateQueries({
        queryKey: ['suggestionsTable'],
      });
      queryClient.removeQueries({ queryKey: ['suggestion', suggestionId] });
    },
  });
}
