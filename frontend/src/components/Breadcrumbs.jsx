import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (path) => {
    const names = {
      men: "Men's",
      women: "Women's",
      watches: 'Watches',
      lenses: 'Eyewear',
      accessories: 'Accessories',
      cart: 'Cart',
      checkout: 'Checkout',
      profile: 'Profile',
      'new-arrival': 'New Arrivals',
      sale: 'Sale',
    };
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link to="/" className="hover:text-gray-900 flex items-center">
        <Home className="w-4 h-4" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <div key={name} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 font-medium">{getBreadcrumbName(name)}</span>
            ) : (
              <Link to={routeTo} className="hover:text-gray-900">
                {getBreadcrumbName(name)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

