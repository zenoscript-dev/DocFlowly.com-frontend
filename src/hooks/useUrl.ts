
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface FilterParam {
  key: string;
  value: string;
  checked: boolean;
}

interface UseUrlParams {
  paramKeys: string[];
}

interface UseUrlReturn {
  params: Record<string, string[]>;
  setParams: (filterParams: FilterParam[], searchTerm?: string, pagination?: string, pageSize?: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  setPagination: (page: string) => void;
  setRangeParam: (key: string, range: [number, number]) => void;
  getRangeParam: (key: string) => [number, number] | null;
  clearParams: () => void;
}

export function useUrl({ paramKeys }: UseUrlParams): UseUrlReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  // Memoize params parsing to avoid recalculation on every render
  const params = useMemo(() => {
    return paramKeys.reduce((acc, key) => {
      const value = searchParams.get(key);
      acc[key] = value ? value.split(',').filter(Boolean) : [];
      return acc;
    }, {} as Record<string, string[]>);
  }, [searchParams, paramKeys]);

  // Optimized setParams with change detection
  const setParams = useCallback((
    filterParams: FilterParam[],
    searchTerm?: string,
    pagination?: string,
    pageSize?: string
  ) => {
    setSearchParams((currentParams) => {
      let hasChanges = false;
      const newParams = new URLSearchParams(currentParams);

      // Handle filter params with change detection
      filterParams.forEach(({ key, value, checked }) => {
        const currentValues = newParams.get(key)?.split(',').filter(Boolean) || [];
        let newValues: string[];

        if (checked) {
          // Add value if not already present
          newValues = currentValues.includes(value) 
            ? currentValues 
            : [...currentValues, value];
        } else {
          // Remove value
          newValues = currentValues.filter(v => v !== value);
        }

        const newValueString = newValues.join(',');
        const currentValueString = currentValues.join(',');

        if (newValueString !== currentValueString) {
          hasChanges = true;
          if (newValues.length > 0) {
            newParams.set(key, newValueString);
          } else {
            newParams.delete(key);
          }
        }
      });

      // Handle search term with change detection
      const currentSearch = newParams.get('search') || '';
      if (searchTerm !== undefined) {
        if (currentSearch !== searchTerm) {
          hasChanges = true;
          if (searchTerm && searchTerm.length > 0) {
            newParams.set('search', searchTerm);
          } else {
            newParams.delete('search');
          }
        }
      }

      // Handle pagination with change detection
      const currentPagination = newParams.get('pagination') || '';
      if (pagination !== undefined) {
        if (currentPagination !== pagination) {
          hasChanges = true;
          if (pagination && pagination.length > 0) {
            newParams.set('pagination', pagination);
          } else {
            newParams.delete('pagination');
          }
        }
      }

      // Handle page size with change detection
      const currentPageSize = newParams.get('pageSize') || '';
      if (pageSize !== undefined) {
        if (currentPageSize !== pageSize) {
          hasChanges = true;
          if (pageSize && pageSize.length > 0) {
            newParams.set('pageSize', pageSize);
          } else {
            newParams.delete('pageSize');
          }
        }
      }

      // Only return new params if there were actual changes
      if (hasChanges) {
        // Create new URLSearchParams with desired order: filters first, then pagination
        const orderedParams = new URLSearchParams();
        
        // Add filter parameters first (in the order they appear in paramKeys)
        paramKeys.forEach(key => {
          if (key !== 'search' && key !== 'pagination' && key !== 'pageSize') {
            const value = newParams.get(key);
            if (value) {
              orderedParams.set(key, value);
            }
          }
        });
        
        // Add search term
        const searchValue = newParams.get('search');
        if (searchValue) {
          orderedParams.set('search', searchValue);
        }
        
        // Add pagination
        const paginationValue = newParams.get('pagination');
        if (paginationValue) {
          orderedParams.set('pagination', paginationValue);
        }
        
        // Add page size
        const pageSizeValue = newParams.get('pageSize');
        if (pageSizeValue) {
          orderedParams.set('pageSize', pageSizeValue);
        }
        
        return orderedParams;
      }
      
      return currentParams;
    });
  }, [setSearchParams]);

  // Optimized search term setter
  const setSearchTerm = useCallback((searchTerm: string) => {
    setSearchParams((currentParams) => {
      const currentSearch = currentParams.get('search') || '';
      if (currentSearch === searchTerm) {
        return currentParams; // No change needed
      }

      const newParams = new URLSearchParams(currentParams);
      if (searchTerm && searchTerm.length > 0) {
        newParams.set('search', searchTerm);
      } else {
        newParams.delete('search');
      }
      
      // Reset pagination to page 1 when search changes
      newParams.delete('pagination');
      
      return newParams;
    });
  }, [setSearchParams]);

  // Optimized pagination setter
  const setPagination = useCallback((page: string) => {
    setSearchParams((currentParams) => {
      const currentPage = currentParams.get('pagination') || '';
      if (currentPage === page) {
        return currentParams; // No change needed
      }

      const newParams = new URLSearchParams(currentParams);
      if (page && page.length > 0) {
        newParams.set('pagination', page);
      } else {
        newParams.delete('pagination');
      }
      
      // Reorder parameters: filters first, then pagination
      const orderedParams = new URLSearchParams();
      
      // Add filter parameters first
      paramKeys.forEach(key => {
        if (key !== 'search' && key !== 'pagination' && key !== 'pageSize') {
          const value = newParams.get(key);
          if (value) {
            orderedParams.set(key, value);
          }
        }
      });
      
      // Add search term
      const searchValue = newParams.get('search');
      if (searchValue) {
        orderedParams.set('search', searchValue);
      }
      
      // Add pagination
      const paginationValue = newParams.get('pagination');
      if (paginationValue) {
        orderedParams.set('pagination', paginationValue);
      }
      
      // Add page size
      const pageSizeValue = newParams.get('pageSize');
      if (pageSizeValue) {
        orderedParams.set('pageSize', pageSizeValue);
      }
      
      return orderedParams;
    });
  }, [setSearchParams, paramKeys]);

  // Set range parameter
  const setRangeParam = useCallback((key: string, range: [number, number]) => {
    setSearchParams((currentParams) => {
      const newParams = new URLSearchParams(currentParams);
      const rangeString = `${range[0]}-${range[1]}`;
      const currentRange = newParams.get(key);
      
      if (currentRange !== rangeString) {
        if (range[0] === 0 && range[1] === 20) {
          // Default range, remove from URL
          newParams.delete(key);
        } else {
          newParams.set(key, rangeString);
        }
        return newParams;
      }
      return currentParams;
    });
  }, [setSearchParams]);

  // Get range parameter
  const getRangeParam = useCallback((key: string): [number, number] | null => {
    const rangeString = searchParams.get(key);
    if (!rangeString) return null;
    
    const parts = rangeString.split('-');
    if (parts.length !== 2) return null;
    
    const min = parseInt(parts[0], 10);
    const max = parseInt(parts[1], 10);
    
    if (isNaN(min) || isNaN(max)) return null;
    
    return [min, max];
  }, [searchParams]);

  // Clear all params
  const clearParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    params,
    setParams,
    setSearchTerm,
    setPagination,
    setRangeParam,
    getRangeParam,
    clearParams
  };
}
