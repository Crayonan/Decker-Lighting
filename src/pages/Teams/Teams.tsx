import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Employee {
  name: string
  role: string
  bio: string
  image: string
  specialties: string[]
  email: string
}

const employees: Employee[] = [
  {
    name: "Niklas Decker",
    role: "Senior Light Engineer",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "https://i.pravatar.cc/300?img=1",
    specialties: ["LED Technology", "Smart Lighting", "Sustainable Design"],
    email: "niklas.decker1@lightco.com"
  },
  {
    name: "Niklas Decker",
    role: "Architectural Lighting Designer",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    image: "https://i.pravatar.cc/300?img=2",
    specialties: ["Architectural Lighting", "3D Modeling", "Hospitality Design"],
    email: "niklas.decker2@lightco.com"
  },
  {
    name: "Niklas Decker",
    role: "R&D Light Engineer",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    image: "https://i.pravatar.cc/300?img=3",
    specialties: ["Quantum Dot LEDs", "Optics", "Product Development"],
    email: "niklas.decker3@lightco.com"
  }
]

export function TeamsPage() {
  return (
    <div className="min-h-screen py-12 pb-32 bg-dark-bg text-dark-text"> {/* Added pb-32 for bottom padding */}
      <div className="container mx-auto px-4 max-w-[1400px]"> {/* Added max-w-[1400px] for centering */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Meet Our Exceptional Team</h2>
          <p className="max-w-2xl mx-auto text-dark-text-secondary">
            At our company, we pride ourselves on the expertise and dedication of our light engineering team. 
            Each member brings a unique set of skills and experiences that contribute to our innovative solutions 
            in the field of lighting technology. Get to know the brilliant minds behind our cutting-edge designs.
          </p>
        </div>
        
        <h2 className="mb-8 text-2xl font-bold text-center">Our Light Engineering Team</h2>
        
        <div className="grid grid-cols-1 gap-8 px-20 sm:px-0 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <Card key={employee.email} className="bg-dark-card-bg border-dark-card-border">
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