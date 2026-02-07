import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  MapPin,
  Users,
  Globe,
  Search,
  Building2,
  Briefcase,
  TrendingUp,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';

interface LocationData {
  city: string;
  state?: string;
  country: string;
  count: number;
  alumni: any[];
  topCompanies: string[];
  topRoles: string[];
}

export function GeographicAlumniMap() {
  const { alumni } = useApp();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Parse locations from alumni data
  const getLocationData = (): LocationData[] => {
    const locationMap = new Map<string, any[]>();

    alumni.forEach(alum => {
      if (alum.location) {
        const existing = locationMap.get(alum.location) || [];
        locationMap.set(alum.location, [...existing, alum]);
      }
    });

    return Array.from(locationMap.entries())
      .map(([location, alumniList]) => {
        const companies = alumniList.map(a => a.currentOrganization).filter(Boolean) as string[];
        const roles = alumniList.map(a => a.currentRole).filter(Boolean) as string[];
        
        const topCompanies = [...new Set(companies)].slice(0, 3);
        const roleCounts = roles.reduce((acc, role) => {
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const topRoles = Object.entries(roleCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([role]) => role);

        // Parse city and state/country
        const parts = location.split(',').map(p => p.trim());
        return {
          city: parts[0] || location,
          state: parts[1],
          country: parts[parts.length - 1] || 'USA',
          count: alumniList.length,
          alumni: alumniList,
          topCompanies,
          topRoles
        };
      })
      .sort((a, b) => b.count - a.count);
  };

  const locations = getLocationData();
  
  const filteredLocations = locations.filter(loc =>
    loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLocationData = selectedLocation 
    ? locations.find(l => `${l.city}, ${l.state || l.country}` === selectedLocation)
    : null;

  const totalCities = locations.length;
  const totalCountries = new Set(locations.map(l => l.country)).size;
  const topLocation = locations[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Geographic Alumni Network</h1>
        <p className="text-muted-foreground">
          Discover and connect with alumni around the world
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alumni</p>
                <p className="text-2xl font-semibold mt-1">{alumni.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <Users className="w-6 h-6" style={{ color: '#0F766E' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cities</p>
                <p className="text-2xl font-semibold mt-1">{totalCities}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                <MapPin className="w-6 h-6" style={{ color: '#E07A2F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Countries</p>
                <p className="text-2xl font-semibold mt-1">{totalCountries}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                <Globe className="w-6 h-6" style={{ color: '#C75B12' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Hub</p>
                <p className="text-lg font-semibold mt-1">{topLocation?.city}</p>
                <p className="text-xs text-muted-foreground">{topLocation?.count} alumni</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#0D5C57' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by city, state, or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Locations List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Alumni Locations
            </CardTitle>
            <CardDescription>Click on a location to view details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredLocations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No locations found</p>
              </div>
            ) : (
              filteredLocations.map((location, index) => {
                const locationKey = `${location.city}, ${location.state || location.country}`;
                const isSelected = selectedLocation === locationKey;
                const percentage = (location.count / alumni.length) * 100;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedLocation(locationKey)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-[#0F766E] bg-[#CDEDEA] bg-opacity-30'
                        : 'hover:border-[#0F766E]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#CDEDEA' }}
                        >
                          <span className="font-semibold" style={{ color: '#0F766E' }}>
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{location.city}</h4>
                          <p className="text-sm text-muted-foreground">
                            {location.state || location.country}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg" style={{ color: '#0F766E' }}>
                          {location.count}
                        </p>
                        <p className="text-xs text-muted-foreground">alumni</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 rounded-full bg-[#FAEBDD]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: '#0F766E'
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {percentage.toFixed(1)}% of total
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Location Details
            </CardTitle>
            <CardDescription>
              {selectedLocationData 
                ? `${selectedLocationData.city}, ${selectedLocationData.state || selectedLocationData.country}`
                : 'Select a location to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedLocationData ? (
              <div className="space-y-6">
                {/* Overview */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#CDEDEA' }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Alumni</p>
                      <p className="text-2xl font-semibold" style={{ color: '#0F766E' }}>
                        {selectedLocationData.count}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Companies</p>
                      <p className="text-2xl font-semibold" style={{ color: '#0F766E' }}>
                        {selectedLocationData.topCompanies.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Top Companies */}
                {selectedLocationData.topCompanies.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Top Companies
                    </h4>
                    <div className="space-y-2">
                      {selectedLocationData.topCompanies.map((company, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                          <span className="font-medium">{company}</span>
                          <Badge variant="outline">
                            {selectedLocationData.alumni.filter(a => a.currentOrganization === company).length} alumni
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Roles */}
                {selectedLocationData.topRoles.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Common Roles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocationData.topRoles.map((role, idx) => (
                        <Badge key={idx} style={{ backgroundColor: '#FFD6B8', color: '#C75B12' }}>
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alumni List */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Alumni in this Location
                  </h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {selectedLocationData.alumni.map(alum => (
                      <div key={alum.id} className="p-3 rounded-lg border hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                          {alum.avatar && (
                            <img
                              src={alum.avatar}
                              alt={alum.name}
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-sm">{alum.name}</h5>
                            <p className="text-xs font-medium" style={{ color: '#0F766E' }}>
                              {alum.currentRole}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {alum.currentOrganization}
                            </p>
                            {alum.graduationYear && (
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  Class of {alum.graduationYear}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <MapPin className="w-16 h-16 mb-4 opacity-30" />
                <p>Select a location from the list to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Regional Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Regional Distribution
          </CardTitle>
          <CardDescription>Alumni spread across different countries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from(new Set(locations.map(l => l.country))).map(country => {
              const countryLocations = locations.filter(l => l.country === country);
              const countryTotal = countryLocations.reduce((sum, l) => sum + l.count, 0);
              const percentage = (countryTotal / alumni.length) * 100;

              return (
                <div key={country} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{country}</span>
                      <Badge variant="outline">{countryLocations.length} cities</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {countryTotal} alumni
                      </span>
                      <span className="font-semibold" style={{ color: '#0F766E' }}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full bg-[#FAEBDD]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: '#0F766E'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
