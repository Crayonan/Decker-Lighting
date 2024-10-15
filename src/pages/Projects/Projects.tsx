import React, { useEffect, useState } from "react";
import { useScramble } from "use-scramble";
import { client } from "../../contentfulClient";

interface TeamMemberFields {
  name: string;
  title: string;
  description: string;
  specialties?: string[];
  email: string;
  avatar?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
}

interface TeamMember {
  sys: {
    id: string;
  };
  fields: TeamMemberFields;
}

const TeamMember: React.FC<{ member: TeamMember }> = ({ member }) => {
  const { ref: nameRef } = useScramble({
    text: member.fields.name,
    speed: 1000,
  });
  const { ref: titleRef } = useScramble({
    text: member.fields.title,
    speed: 1000,
  });

  return (
    <div className="project-item team-member">
      <div className="member-avatar">
        <img 
          src={member.fields.avatar?.fields?.file?.url || "/api/placeholder/100/100"} 
          alt={member.fields.name} 
        />
      </div>
      <div className="member-info">
        <div className="project-title member-name">
          <p ref={nameRef}>{member.fields.name}</p>
        </div>
        <div className="project-copy member-title">
          <p ref={titleRef}>{member.fields.title}</p>
        </div>
        <div className="member-description">
          <p>{member.fields.description}</p>
        </div>
        <div className="member-specialties">
          {member.fields.specialties && member.fields.specialties.map((specialty, index) => (
            <span key={index} className="specialty-tag">{specialty}</span>
          ))}
        </div>
        <div className="member-contact">
          <p>{member.fields.email}</p>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client.getEntries<TeamMemberFields>({
      content_type: "teamMember"
    })
      .then((response) => {
        setTeamMembers(response.items as TeamMember[]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Contentful entries:", error);
        setError("Failed to fetch team members. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading team members...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container page-teams">
      <h1>Meet Our Exceptional Team</h1>
      <p className="team-description">
        At our company, we pride ourselves on the expertise and dedication of our
        engineering team. Each member brings a unique set of skills and experiences that
        contribute to our innovative solutions. Get to know the
        brilliant minds behind our cutting-edge designs.
      </p>
      <h2>Our Engineering Team</h2>
      <div className="team-members-grid">
        {teamMembers.map((member) => (
          <TeamMember key={member.sys.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default Projects;