import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import '../assets/styles/pagination.css';

const Paginate = ({pages, page, isAdmin = false, keyword = '', team = ''}) => {
  const location = useLocation();

  // Determine the correct pagination URL based on current location
  const getPaginationUrl = (pageNum) => {
    if (isAdmin) {
      // For admin pages, use query parameters instead of route parameters
      const params = new URLSearchParams();
      params.set('page', pageNum);
      if (keyword) {
        params.set('keyword', keyword);
      }
      return `/admin/productlist?${params.toString()}`;
    }

    if (team) {
      return `/teams/${encodeURIComponent(team)}?page=${pageNum}`;
    }

    if (keyword) {
      return `/search/${keyword}/page/${pageNum}`;
    }

    // Check if we're on the products page
    if (location.pathname.startsWith('/products')) {
      return `/products/page/${pageNum}`;
    }

    // Default to home page pagination
    return `/page/${pageNum}`;
  };

  // Generate page numbers to show (with ellipsis for large page counts)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (pages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (page <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(pages);
      } else if (page >= pages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = pages - 3; i <= pages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(pages);
      }
    }

    return pageNumbers;
  };

  if (pages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className='pagination-container'>
      <div className='custom-pagination'>
        {/* Previous Arrow */}
        <Link
          to={page > 1 ? getPaginationUrl(page - 1) : '#'}
          className={`pagination-arrow ${page <= 1 ? 'disabled' : ''}`}
          onClick={(e) => page <= 1 && e.preventDefault()}
        >
          <FaChevronLeft />
        </Link>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum, index) => (
          <React.Fragment key={index}>
            {pageNum === '...' ? (
              <span className='pagination-dots'>...</span>
            ) : (
              <Link
                to={getPaginationUrl(pageNum)}
                className={`pagination-item ${pageNum === page ? 'active' : ''}`}
              >
                {pageNum}
              </Link>
            )}
          </React.Fragment>
        ))}

        {/* Next Arrow */}
        <Link
          to={page < pages ? getPaginationUrl(page + 1) : '#'}
          className={`pagination-arrow ${page >= pages ? 'disabled' : ''}`}
          onClick={(e) => page >= pages && e.preventDefault()}
        >
          <FaChevronRight />
        </Link>
      </div>

      {/* Page Info */}
      <div className='pagination-info'>
        <span>
          Page {page} of {pages}
        </span>
        <span>•</span>
        <span>{pages} total pages</span>
      </div>
    </div>
  );
};

export default Paginate;
