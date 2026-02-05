import { useState } from 'react';

const ChevronIcon = ({ isOpen }) => (
  <svg 
    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const FilterSection = ({ title, isOpen, onToggle, activeCount, children }) => (
  <div className="border-b border-[#E8E4DD]">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 text-left hover:bg-[#EBE7E0] transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-black rounded-full">
            {activeCount}
          </span>
        )}
      </div>
      <ChevronIcon isOpen={isOpen} />
    </button>
    
    <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[500px] pb-4' : 'max-h-0'}`}>
      {children}
    </div>
  </div>
);

const RadioOption = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 py-2 cursor-pointer group" onClick={onChange}>
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
      ${checked ? 'border-gray-900 bg-[#FDFCFA]' : 'border-[#C5C1BA] bg-[#FDFCFA] group-hover:border-gray-500'}`}
    >
      {checked && <div className="w-2 h-2 rounded-full bg-gray-900" />}
    </div>
    <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
      {label}
    </span>
  </label>
);

const CheckboxOption = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 py-2 cursor-pointer group" onClick={onChange}>
    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
      ${checked ? 'bg-gray-900 border-gray-900' : 'border-[#C5C1BA] bg-[#FDFCFA] group-hover:border-gray-500'}`}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
      {label}
    </span>
  </label>
);

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, brands = [], sizes = [], isMobile = false }) => {
  const [openSections, setOpenSections] = useState({ sort: false, price: false, brand: true, size: false });
  
  const toggle = (section) => setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
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

  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: Infinity },
  ];

  const isPriceRangeActive = (range) => {
    return filters.priceRange?.min === range.min && filters.priceRange?.max === range.max;
  };

  return (
    <div className="h-full">
      {/* Header - Only on Desktop */}
      {!isMobile && (
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-[#E8E4DD]">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          </div>
          {getActiveCount() > 0 && (
            <button 
              onClick={onClearFilters}
              className="text-xs font-medium text-gray-600 hover:text-black transition-colors underline underline-offset-2"
            >
              Clear all
            </button>
          )}
        </div>
      )}
      
      {/* Mobile Clear All Button */}
      {isMobile && getActiveCount() > 0 && (
        <div className="flex justify-end mb-3">
          <button 
            onClick={onClearFilters}
            className="text-xs font-medium text-gray-500 hover:text-black transition-colors underline underline-offset-2"
          >
            Clear all ({getActiveCount()})
          </button>
        </div>
      )}

      {/* Brands - First Filter */}
      {brands.length > 0 && (
        <FilterSection 
          title="Brand" 
          isOpen={openSections.brand} 
          onToggle={() => toggle('brand')}
          activeCount={filters.brands?.length || 0}
        >
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {brands.map(brand => (
              <CheckboxOption
                key={brand}
                label={brand}
                checked={(filters.brands || []).includes(brand)}
                onChange={() => handleToggleList('brands', brand)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Sort */}
      <FilterSection 
        title="Sort By" 
        isOpen={openSections.sort} 
        onToggle={() => toggle('sort')}
        activeCount={filters.sortBy && filters.sortBy !== 'default' ? 1 : 0}
      >
        <div className="space-y-0.5">
          {[
            { id: 'default', label: 'Recommended' },
            { id: 'newest', label: 'Newest First' },
            { id: 'price-low-high', label: 'Price: Low to High' },
            { id: 'price-high-low', label: 'Price: High to Low' },
          ].map((opt) => (
            <RadioOption
              key={opt.id}
              label={opt.label}
              checked={filters.sortBy === opt.id || (!filters.sortBy && opt.id === 'default')}
              onChange={() => update('sortBy', opt.id)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection 
        title="Price" 
        isOpen={openSections.price} 
        onToggle={() => toggle('price')}
        activeCount={filters.priceRange ? 1 : 0}
      >
        <div className="space-y-0.5">
          {priceRanges.map((range, idx) => (
            <RadioOption
              key={idx}
              label={range.label}
              checked={isPriceRangeActive(range)}
              onChange={() => update('priceRange', { min: range.min, max: range.max })}
            />
          ))}
        </div>
        
        {/* Custom Range */}
        <div className="mt-4 pt-4 border-t border-[#E8E4DD]">
          <p className="text-xs text-gray-600 mb-3">Custom Range</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange?.min || ''}
                onChange={(e) => update('priceRange', { 
                  min: Number(e.target.value) || 0, 
                  max: filters.priceRange?.max || Infinity 
                })}
                className="w-full pl-6 pr-2 py-2 text-sm border border-[#D9D5CE] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
            <span className="text-gray-400">—</span>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange?.max === Infinity ? '' : filters.priceRange?.max || ''}
                onChange={(e) => update('priceRange', { 
                  min: filters.priceRange?.min || 0, 
                  max: Number(e.target.value) || Infinity 
                })}
                className="w-full pl-6 pr-2 py-2 text-sm border border-[#D9D5CE] rounded-lg bg-[#FDFCFA] focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Sizes */}
      {sizes.length > 0 && (
        <FilterSection 
          title="Size" 
          isOpen={openSections.size} 
          onToggle={() => toggle('size')}
          activeCount={filters.sizes?.length || 0}
        >
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              const isActive = (filters.sizes || []).includes(size);
              return (
                <button
                  key={size}
                  onClick={() => handleToggleList('sizes', size)}
                  className={`min-w-[40px] h-9 px-3 text-sm font-medium rounded-lg border transition-all
                    ${isActive 
                      ? 'bg-gray-900 text-white border-gray-900' 
                      : 'bg-[#FDFCFA] text-gray-700 border-[#D9D5CE] hover:border-gray-500'
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}
    </div>
  );
};

export default FilterSidebar;
