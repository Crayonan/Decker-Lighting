import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { client } from "../../contentfulClient";

interface Employee {
  name: string;
  role: string;
  bio: string;
  image: string;
  specialties: string[];
  email: string;
}

export function TeamsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await client.getEntries({
          content_type: 'employee'
        });
        const fetchedEmployees = response.items.map((item: any) => ({
          name: item.fields.name,
          role: item.fields.role,
          bio: item.fields.bio,
          image: item.fields.image?.fields?.file?.url || "",
          specialties: item.fields.specialties,
          email: item.fields.email,
        }));
        setEmployees(fetchedEmployees);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to fetch employee data. Please try again later.');
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-dark-bg text-dark-text">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-dark-bg text-dark-text">{error}</div>;
  }

  return (
    <div className="min-h-screen py-8 pb-32 bg-dark-bg text-dark-text">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Meet Our Exceptional Team</h2>
          <p className="max-w-2xl mx-auto text-dark-text-secondary">
            At our company, we pride ourselves on the expertise and dedication of our light engineering team. 
            Each member brings a unique set of skills and experiences that contribute to our innovative solutions 
            in the field of lighting technology. Get to know the brilliant minds behind our cutting-edge designs.
          </p>
        </div>
        
        <h2 className="mb-8 text-2xl font-bold text-center">Our Light Engineering Team</h2>
        
        <div className={`grid gap-8 px-4 sm:px-6 md:px-8 ${
          employees.length < 3 
            ? 'grid-cols-[repeat(auto-fit,minmax(0,360px))] justify-center'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {employees.map((employee) => (
            <Card key={employee.email} className="w-full bg-dark-card-bg border-dark-card-border">
              <CardHeader>
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={employee.image} alt={employee.name} />
                  <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl text-center text-dark-text">{employee.name}</CardTitle>
                <CardDescription className="text-center text-dark-text-secondary">{employee.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-dark-text-secondary">{employee.bio}</p>
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-dark-text">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {employee.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="bg-dark-btn-bg text-dark-text-secondary">{specialty}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-dark-text">Contact:</h4>
                  <p className="text-sm text-dark-text-tertiary">{employee.email}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}