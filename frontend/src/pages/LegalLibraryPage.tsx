import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import DocumentCard from '../components/DocumentCard';
import { Search, Filter, ChevronDown, BookOpen } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  abstract: string;
  type: 'Act' | 'Case' | 'Regulation';
  jurisdiction: string;
  year: number;
}

const LegalLibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  const categories = ['All', 'Constitution', 'Civil', 'Criminal', 'Tax', 'IP', 'Procedure'];
  const jurisdictions = ['All', 'Federal', 'State', 'International'];
  const types = ['All', 'Act', 'Case', 'Regulation'];
  const years = ['All', '2024', '2023', '2022', '2021', '2020'];

  // Mock data
  const documents: Document[] = [
    {
      id: '1',
      title: 'Civil Rights Act of 1964, Title VII - Employment Discrimination',
      abstract: 'Prohibits employment discrimination based on race, color, religion, sex, or national origin. Establishes Equal Employment Opportunity Commission.',
      type: 'Act',
      jurisdiction: 'Federal',
      year: 1964
    },
    {
      id: '2',
      title: 'Miranda v. Arizona (1966)',
      abstract: 'Supreme Court case establishing the requirement that suspects be informed of their rights before custodial interrogation.',
      type: 'Case',
      jurisdiction: 'Federal',
      year: 1966
    },
    {
      id: '3',
      title: 'GDPR - General Data Protection Regulation',
      abstract: 'European Union regulation on data protection and privacy for individuals within the EU and European Economic Area.',
      type: 'Regulation',
      jurisdiction: 'International',
      year: 2018
    },
    {
      id: '4',
      title: 'Americans with Disabilities Act (ADA)',
      abstract: 'Civil rights law that prohibits discrimination based on disability. Requires accommodations in public spaces and employment.',
      type: 'Act',
      jurisdiction: 'Federal',
      year: 1990
    },
    {
      id: '5',
      title: 'Brown v. Board of Education (1954)',
      abstract: 'Landmark Supreme Court case that declared racial segregation in public schools unconstitutional.',
      type: 'Case',
      jurisdiction: 'Federal',
      year: 1954
    },
    {
      id: '6',
      title: 'HIPAA Privacy Rule',
      abstract: 'Regulation establishing national standards for the protection of certain health information and patient privacy rights.',
      type: 'Regulation',
      jurisdiction: 'Federal',
      year: 1996
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJurisdiction = selectedJurisdiction === 'All' || doc.jurisdiction === selectedJurisdiction;
    const matchesType = selectedType === 'All' || doc.type === selectedType;
    const matchesYear = selectedYear === 'All' || doc.year.toString() === selectedYear;
    
    return matchesSearch && matchesJurisdiction && matchesType && matchesYear;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Legal Library</h1>
          <p className="text-lg text-slate-600">Browse and search through comprehensive legal documents</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search Acts, cases, regulations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </div>

                {/* Filters */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="relative">
                    <select
                      value={selectedJurisdiction}
                      onChange={(e) => setSelectedJurisdiction(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    >
                      {jurisdictions.map(jurisdiction => (
                        <option key={jurisdiction} value={jurisdiction}>
                          {jurisdiction} Jurisdiction
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    >
                      {types.map(type => (
                        <option key={type} value={type}>
                          {type === 'All' ? 'All Types' : type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>
                          {year === 'All' ? 'All Years' : year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  {filteredDocuments.length} Documents Found
                </h2>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Filter className="w-4 h-4" />
                  <span>Sort by Relevance</span>
                </div>
              </div>

              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No documents found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredDocuments.map((document, index) => (
                    <div
                      key={document.id}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      className="animate-fadeIn"
                    >
                      <DocumentCard
                        title={document.title}
                        abstract={document.abstract}
                        type={document.type}
                        jurisdiction={document.jurisdiction}
                        year={document.year}
                        onOpen={() => console.log('Opening document:', document.id)}
                        onSave={() => console.log('Saving document:', document.id)}
                        onCopyCitation={() => console.log('Copying citation:', document.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalLibraryPage;