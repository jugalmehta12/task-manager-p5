import { useState } from 'react';

function Projects() {
  const [projects] = useState([
    { id: 1, name: 'Task Manager App', status: 'In Progress', description: 'Full-stack task management application built with React, Express, and MongoDB.' },
    { id: 2, name: 'Portfolio Website', status: 'Completed', description: 'Personal portfolio showcasing projects and skills.' },
    { id: 3, name: 'Weather Dashboard', status: 'Planned', description: 'A weather application using external APIs to display forecasts.' },
  ]);

  return (
    <div className="projects-page">
      <h2>My Projects</h2>
      <p className="status-text">Overview of current and past projects.</p>
      <ul className="task-list">
        {projects.map((project) => (
          <li key={project.id} className="task-item">
            <div className="task-main">
              <div className="task-text">
                <span className="title">{project.name}</span>
                <p className="description">{project.description}</p>
                <span className="timestamp">Status: {project.status}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;
