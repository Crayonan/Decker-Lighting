import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { fetchTeamMembers, fetchSiteTexts } from "../../payloadClient";
import type {
  TeamMember as PayloadGeneratedTeamMember,
  Media as PayloadGeneratedMedia
} from "@/types/payload-types";
import { Skeleton } from "@/components/ui/skeleton";
import { RichText } from "@payloadcms/richtext-lexical/react";

const PAYLOAD_PUBLIC_URL = import.meta.env.BACKEND_URL;

interface DisplayTeamMember {
  id: number;
  name: string;
  role: string;
  bio: any; 
  image: string; 
  specialties: string[];
  email: string;
}

export function TeamsPage() {
  const [employees, setEmployees] = useState<DisplayTeamMember[]>([]);
  const [teamText, setTeamText] = useState<string>(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [teamMembersResponse, siteTextsResponse] = await Promise.all([
             fetchTeamMembers(),
             fetchSiteTexts()
        ]);

        const fetchedEmployees = teamMembersResponse.docs.map((item: PayloadGeneratedTeamMember) => {
          const profilePic = item.profilePicture as PayloadGeneratedMedia;
          const relativeUrl = profilePic?.url;
          let absoluteImageUrl = '';

          if (relativeUrl && PAYLOAD_PUBLIC_URL) {
            const publicUrlBase = PAYLOAD_PUBLIC_URL.endsWith('/') ? PAYLOAD_PUBLIC_URL.slice(0, -1) : PAYLOAD_PUBLIC_URL;
            const imagePath = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
            absoluteImageUrl = `${publicUrlBase}${imagePath}`;
          } else if (relativeUrl) {
             absoluteImageUrl = relativeUrl; 
          }

          return {
            id: item.id,
            name: item.name,
            role: item.role,
            bio: item.bio,
            image: absoluteImageUrl, 
            specialties: item.specialties || [],
            email: item.email,
          };
        });
        setEmployees(fetchedEmployees);

        if (siteTextsResponse && siteTextsResponse.teamIntroText) {
          setTeamText(siteTextsResponse.teamIntroText);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // -- Skeleton Loading State --
  if (loading) {
    return (
      <div className="min-h-screen py-8 pb-32 bg-dark-bg text-dark-text">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 text-center">
            <Skeleton className="w-3/4 h-8 mx-auto mb-4" />
            <Skeleton className="w-1/2 h-12 mx-auto" />
          </div>
          <Skeleton className="w-1/4 h-8 mx-auto mb-8" />
          <div className="grid grid-cols-1 gap-8 px-4 sm:px-6 md:px-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="w-full shadow-md rounded-xl bg-dark-card-bg border-dark-card-border">
                <CardHeader>
                  <Skeleton className="w-24 h-24 mx-auto mb-4 rounded-full" />
                  <Skeleton className="w-3/4 h-6 mx-auto mb-2" />
                  <Skeleton className="w-1/2 h-4 mx-auto" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="w-full h-16 mb-4" />
                  <Skeleton className="w-1/3 h-4 mb-2" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="w-20 h-6 rounded-full" />
                    <Skeleton className="w-24 h-6 rounded-full" />
                  </div>
                  <Skeleton className="w-1/3 h-4 mb-2" />
                  <Skeleton className="w-1/2 h-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg text-dark-text">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 pb-32 bg-dark-bg text-dark-text">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 text-center">
          <h2 className="py-8 mx-auto text-3xl font-bold text-center sm:px-4">
            Triff das Team hinter den Kulissen
          </h2>
          {typeof teamText === 'object' && teamText !== null && Object.keys(teamText).length > 0 ? (
            <div className="max-w-2xl mx-auto text-dark-text-secondary rich-text-content">
              <RichText data={teamText} />
            </div>
          ) : (
            <p className="max-w-2xl mx-auto text-dark-text-secondary">
              {typeof teamText === 'string' ? teamText : ''}
            </p>
          )}
        </div>

        <h2 className="mb-8 text-2xl font-bold text-center">
          Wir stellen uns vor
        </h2>

        <div
          className={`grid gap-8 px-4 sm:px-6 md:px-8 ${
            employees.length === 0 ? 'grid-cols-1' :
            employees.length < 3
              ? "grid-cols-[repeat(auto-fit,minmax(0,360px))] justify-center"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {employees.length === 0 && !loading && (
            <p className="text-center text-dark-text-secondary col-span-full">No team members found.</p>
          )}
          {employees.map((employee) => (
            <Card
              key={employee.id}
              className="w-full shadow-md rounded-xl bg-dark-card-bg border-dark-card-border"
            >
              <CardHeader>
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={employee.image} alt={employee.name} />
                  <AvatarFallback>
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl text-center text-dark-text">
                  {employee.name}
                </CardTitle>
                <CardDescription className="text-center text-dark-text-secondary">
                  {employee.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-sm text-dark-text-secondary rich-text-bio">
                  {employee.bio && typeof employee.bio === 'object' && Object.keys(employee.bio).length > 0 ? (
                    <RichText data={employee.bio} />
                  ) : (
                    <p>{typeof employee.bio === 'string' ? employee.bio : 'No bio available.'}</p>
                  )}
                </div>
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-dark-text">
                    Referenzen:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(employee.specialties || []).map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="secondary"
                        className="bg-dark-btn-bg text-dark-text-secondary"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-dark-text">
                    Kontakt:
                  </h4>
                  <p className="text-sm text-dark-text-tertiary">
                    {employee.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}