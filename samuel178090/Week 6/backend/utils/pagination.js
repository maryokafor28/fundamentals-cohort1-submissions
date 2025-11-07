export const getPagination = (page, size) => {
    const limit = size ? Math.max(1, Math.min(+size, 100)) : 10; // Limit between 1-100
    const currentPage = page ? Math.max(1, +page) : 1; // Pages start from 1
    const offset = (currentPage - 1) * limit; // Correct offset calculation
    
    return { limit, offset, page: currentPage };
};

export const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? Math.max(1, +page) : 1; // Pages start from 1
    const totalPages = Math.ceil(totalItems / limit);
    
    return { 
        totalItems, 
        items, 
        totalPages, 
        currentPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
};