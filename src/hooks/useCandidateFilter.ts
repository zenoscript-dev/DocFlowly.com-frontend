// src/hooks/useCandidateFilter.ts
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function useCandidateFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const status = searchParams.get('status')?.split(',') || [];
    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page'));
    const pageSize = Number(searchParams.get('pageSize'));

    // const handleStatusChange = (status: string, checked: boolean) => {
    //     if (checked) {
    //         setSearchParams((params) => {
    //             params.set('status', status);
    //             return params;
    //         })
    //     } else {
    //         setSearchParams((params) => {
    //             params.delete('status');
    //             return params;
    //         })
    //     }
    // }

    const setFilters = useCallback((status:{status: string, checked: boolean}[], search: string, page: number, pageSize: number) => {
        setSearchParams((params) => {

            if (status.length > 0) {
                params.set('status', status.filter(s => s.checked).map(s => s.status).join(','));
            } else {
                params.delete('status');
            }
            
            if (search && search.trim() !== '') {
                params.set('search', search);
            } else {
                params.delete('search');
            }
        
            if (page && page > 1) {
                params.set('page', page.toString());
            } else {
                params.delete('page');
            }
            
            if (pageSize && pageSize !== 10) {
                params.set('pageSize', pageSize.toString());
            } else {
                params.delete('pageSize');
            }
            
            return params;
        });
    }, [setSearchParams]);

    return {
        status,
        search,
        page,
        pageSize,
        setFilters,
        // handleStatusChange
    };
}