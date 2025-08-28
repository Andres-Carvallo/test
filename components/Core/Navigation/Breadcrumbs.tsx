import React from "react";
import Link from "next/link";

interface BreadcrumbsProps {
  category?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ category }) => {
  return (
    <nav className="flex py-4 text-gray-600">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="hover:text-gray-900"
          >
            Inicio
          </Link>
        </li>
        <li className="flex items-center space-x-2">
          <span>/</span>
          <Link
            href="/tienda"
            className="hover:text-gray-900"
          >
            Tienda
          </Link>
        </li>
        {category && (
          <>
            <li className="flex items-center space-x-2">
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {category}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
