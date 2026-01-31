import { useState } from 'react';

// --- Polished Icons ---
const ChevronIcon = ({ isOpen }) => (
  <svg 
    className={`w-4 h-4 text-gray-500 transition-all duration-300 ease-out ${isOpen ? 'rotate-180 text-gray-900' : ''}`} 
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

const PriceIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BrandIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const SizeIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
  </svg>
);

// --- Custom UI Elements ---

const FilterSection = ({ title, isOpen, onToggle, activeCount, children, icon: Icon }) => (
  <div className="border-b border-gray-200 last:border-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 px-6 group focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-inset rounded-lg transition-all duration-200 hover:bg-gray-50/50"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`transition-colors duration-200 ${isOpen ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
            <Icon />
          </div>
        )}
        <h3 className={`text-sm font-semibold tracking-wide transition-colors duration-200 ${isOpen ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
          {title}
        </h3>
        {activeCount > 0 && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-gray-800 to-gray-700 rounded-full shadow-sm animate-pulse">
            {activeCount}
          </span>
        )}
      </div>
      <ChevronIcon isOpen={isOpen} />
    </button>
    
    <div 
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-[600px] opacity-100 pb-4' : 'max-h-0 opacity-0 pb-0'
      }`}
    >
      <div className="px-6 pt-2">
        {children}
      </div>
    </div>
  </div>
);

const CustomCheckbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group py-2.5 px-2 -mx-2 select-none transition-all duration-200 hover:bg-gray-50 active:bg-gray-100">
    <div className="relative flex-shrink-0">
      <input 
        type="checkbox" 
        className="peer sr-only" 
        checked={checked} 
        onChange={onChange} 
      />
      <div className={`
        w-5 h-5 border-2 rounded transition-all duration-300 ease-out flex items-center justify-center
        ${checked 
          ? 'bg-gray-900 border-gray-900 shadow-lg shadow-gray-900/30 scale-105' 
          : 'bg-white border-gray-300 group-hover:border-gray-400 group-hover:bg-gray-50'
        }
      `}>
        <svg className={`w-3.5 h-3.5 text-white transform transition-all duration-300 ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    <span className={`text-sm transition-all duration-200 ${checked ? 'text-gray-900 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
      {label}
    </span>
  </label>
);

const CustomRadio = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group py-2.5 px-2 -mx-2 rounded-lg select-none transition-all duration-200 hover:bg-gray-50 active:bg-gray-100">
    <div className="relative flex items-center flex-shrink-0">
      <input type="radio" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`
        w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center
        ${checked ? 'border-gray-900 shadow-md shadow-gray-900/20' : 'border-gray-300 group-hover:border-gray-400'}
      `}>
        <div className={`w-2.5 h-2.5 rounded-full bg-gray-900 transform transition-all duration-300 ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
      </div>
    </div>
    <span className={`text-sm transition-all duration-200 ${checked ? 'text-gray-900 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
      {label}
    </span>
  </label>
);

// --- Main Component ---

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, brands = [], sizes = [] }) => {
  const [openSections, setOpenSections] = useState({ sort: true, price: true, brand: true, size: true });
  
  const toggle = (section) => setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  
  // Handlers
  const update = (key, val) => onFilterChange({ ...filters, [key]: val });
  
  const handleToggleList = (key, item) => {
    const list = filters[key] || [];
    const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
    update(key, newList);
  };

  const getActiveCount = () => {
    let count = 0;
    if (filters.priceRange) count++;
    if (filters.brands?.length) count += filters.brands.length;
    if (filters.sizes?.length) count += filters.sizes.length;
    if (filters.sortBy && filters.sortBy !== 'default') count++;
    return count;
  };

  return (
    <div className="w-full bg-white border border-gray-200 overflow-hidden sticky top-[48px] shadow-sm hover:shadow-md transition-shadow duration-300 mt-0 max-h-[calc(100vh-48px)] flex flex-col">
      
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-900 rounded-lg shadow-sm">
            <FilterIcon />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            {getActiveCount() > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">{getActiveCount()} active filter{getActiveCount() !== 1 ? 's' : ''}</p>
            )}
          </div>
        </div>
        
        {getActiveCount() > 0 && (
          <button 
            onClick={onClearFilters}
            className="text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 px-3 py-1.5 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Content */}
      <div className="py-2 overflow-y-auto flex-1 custom-scrollbar">
        
        {/* Sort Section */}
        <FilterSection 
          title="Sort By" 
          isOpen={openSections.sort} 
          onToggle={() => toggle('sort')}
          activeCount={filters.sortBy && filters.sortBy !== 'default' ? 1 : 0}
          icon={SortIcon}
        >
          <div className="space-y-1">
            {[
              { id: 'default', label: 'Recommended' },
              { id: 'newest', label: 'Newest Arrivals' },
              { id: 'price-low-high', label: 'Price: Low to High' },
              { id: 'price-high-low', label: 'Price: High to Low' },
            ].map((opt) => (
              <CustomRadio
                key={opt.id}
                label={opt.label}
                checked={filters.sortBy === opt.id || (!filters.sortBy && opt.id === 'default')}
                onChange={() => update('sortBy', opt.id)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Price Section */}
        <FilterSection 
          title="Price Range" 
          isOpen={openSections.price} 
          onToggle={() => toggle('price')}
          activeCount={filters.priceRange ? 1 : 0}
          icon={PriceIcon}
        >
          {/* Custom Range Inputs */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-5 rounded-xl border border-gray-200 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold group-focus-within:text-gray-900 transition-colors">₹</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.min || ''}
                  onChange={(e) => update('priceRange', { ...filters.priceRange, min: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all text-gray-900 font-semibold shadow-sm hover:shadow"
                />
              </div>
              <span className="text-gray-400 font-bold text-lg">-</span>
              <div className="relative flex-1 group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold group-focus-within:text-gray-900 transition-colors">₹</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.max === Infinity ? '' : filters.priceRange?.max || ''}
                  onChange={(e) => update('priceRange', { ...filters.priceRange, max: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all text-gray-900 font-semibold shadow-sm hover:shadow"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Brand Section */}
        {brands.length > 0 && (
          <FilterSection 
            title="Brands" 
            isOpen={openSections.brand} 
            onToggle={() => toggle('brand')}
            activeCount={filters.brands?.length || 0}
            icon={BrandIcon}
          >
            <div className="space-y-0.5 max-h-56 overflow-y-auto custom-scrollbar -mr-2 pr-2">
              {brands.map(brand => (
                <CustomCheckbox
                  key={brand}
                  label={brand}
                  checked={(filters.brands || []).includes(brand)}
                  onChange={() => handleToggleList('brands', brand)}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Sizes Section */}
        <FilterSection 
          title="Size" 
          isOpen={openSections.size} 
          onToggle={() => toggle('size')}
          activeCount={filters.sizes?.length || 0}
          icon={SizeIcon}
        >
          {sizes.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {sizes.map(size => {
                const isActive = (filters.sizes || []).includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleToggleList('sizes', size)}
                    className={`
                      min-w-[44px] h-11 px-4 flex items-center justify-center text-sm font-bold rounded-lg border-2 transition-all duration-300
                      ${isActive 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/30 transform scale-105 ring-2 ring-gray-900/20' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md active:scale-95'
                      }
                    `}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500 py-2 italic">
              No sizes available for these products
            </div>
          )}
        </FilterSection>
      </div>

      {/* Styled Scrollbar CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #d1d5db, #9ca3af);
          border-radius: 10px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9ca3af, #6b7280);
        }
      `}</style>
    </div>
  );
};

export default FilterSidebar;