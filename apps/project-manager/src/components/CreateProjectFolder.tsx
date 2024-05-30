import axios from 'axios';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { URLDisplay } from './URLDisplay';

enum ProjectType {
  GUIDE,
  SHORT,
  COURSE,
}

interface ProjectData {
  projectType: number
  projectNumber: number
  projectName: string
}

interface CreatedProjectData {
  projectLink: string
  uploadLink: string
}

const ProjectForm: React.FC = () => {
  const [jobFinished, setJobFinished] = useState(false)
  const [projectType, setProjectType] = useState<number>(ProjectType.GUIDE);
  const [projectNumber, setProjectNumber] = useState<number>(0);
  const [projectName, setProjectName] = useState<string>("");
  const [projectFolderLink, setProjectFolderLink] = useState<string>('Bitch');
  const [filesRequestLink, setFilesRequestLink] = useState<string>('Yeah babyyy');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()

      const backendHost = import.meta.env.VITE_BACKEND_HOST
      const appName = import.meta.env.VITE_APP_NAME

      if (!backendHost || !appName) throw new Error("Missing envs")

      const url = `${backendHost}/${appName}/create-project-folder`
      const body: ProjectData = {
        projectType,
        projectNumber,
        projectName
      }

      setJobFinished(true)
      return
      
      const { data: { projectLink, uploadLink } } = await axios.post<CreatedProjectData>(url, body)
      
      setProjectFolderLink(projectFolderLink)
      setFilesRequestLink(uploadLink)
    } catch (e) {
      console.error(e)
    }
  };

  const handleProjectTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProjectType(Number(e.target.value));
  };

  const handleProjectNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectNumber(Number(e.target.value));
  };

  const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  return (
    <>
      {
        !jobFinished &&
        <form onSubmit={handleSubmit}>
          <div className='formGroup'>
            <label htmlFor="projectType">Project Type:</label>
            <select
              id="projectType"
              value={projectType}
              onChange={handleProjectTypeChange}
            >
              <option value={ProjectType.GUIDE}>Youtube Guide</option>
              <option value={ProjectType.SHORT}>Youtube Short</option>
              <option value={ProjectType.COURSE}>Website Course</option>
            </select>
          </div>
          <div className='formGroup'>
            <label htmlFor="projectNumber">Project Number:</label>
            <input
              type="number"
              id="projectNumber"
              value={projectNumber}
              onChange={handleProjectNumberChange}
            />
          </div>
          <div className='formGroup'>
            <label htmlFor="projectName">Project Name:</label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={handleProjectNameChange}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      }
      {
        jobFinished &&
        <div className='formGroup'>
          <URLDisplay
          title='Project Url'
          url={projectFolderLink}
          ></URLDisplay>
          <URLDisplay
          title='File Uploads Url'
          url={filesRequestLink}
          ></URLDisplay>
        </div>
      }
    </>
  );
};

export default ProjectForm;
