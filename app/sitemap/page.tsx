import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function SitemapPage() {
  // Leer el archivo sitemap.xml
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

  // Extraer las URLs y fechas usando regex
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  const lastmodRegex = /<lastmod>(.*?)<\/lastmod>/g;
  
  const urls: string[] = [];
  const lastmods: string[] = [];
  
  let urlMatch;
  let lastmodMatch;
  
  while ((urlMatch = urlRegex.exec(sitemapContent)) !== null) {
    urls.push(urlMatch[1]);
  }
  
  while ((lastmodMatch = lastmodRegex.exec(sitemapContent)) !== null) {
    lastmods.push(lastmodMatch[1]);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sitemap</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">URL</th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Última modificación</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b text-sm text-gray-900">
                  <a href={url} className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                    {url}
                  </a>
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-600">
                  {format(new Date(lastmods[index]), 'dd/MM/yyyy HH:mm', { locale: es })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 