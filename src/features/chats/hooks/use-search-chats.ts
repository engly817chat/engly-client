import { useQuery } from '@tanstack/react-query';
import { chatsApi } from '@/entities/chats';


export function useSearchChats(categorySlug: string, debaunceSearch: string) {
	const {data, isLoading, isError} = useQuery({
		queryKey: ['searchChats', categorySlug, debaunceSearch],
		queryFn: () => chatsApi.findChats(categorySlug.toUpperCase(), debaunceSearch),
		enabled: !!categorySlug && debaunceSearch.length > 0,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
	});

	return {
		data,
		isLoading,
		isError,
	};
}