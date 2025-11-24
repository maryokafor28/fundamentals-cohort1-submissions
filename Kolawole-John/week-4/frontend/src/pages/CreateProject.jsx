import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCreateProject } from '../hooks/useProjects';
import { PROJECT_STATUS, TECH_STACK_OPTIONS } from '../utils/constants';

export default function CreateProject() {
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const { mutate: createProject, isPending } = useCreateProject();

  const onSubmit = (data) => {
    createProject(data, {
      onSuccess: (project) => {
        navigate(`/projects/${project._id}`);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Create New Project
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="input-field"
                placeholder="My Awesome Project"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={6}
                className="input-field"
                placeholder="Describe your project in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tech Stack (Select all that apply)
              </label>
              <Controller
                name="techStack"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
                    {TECH_STACK_OPTIONS.map((tech) => (
                      <label key={tech} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          value={tech}
                          checked={field.value.includes(tech)}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, tech]
                              : field.value.filter((t) => t !== tech);
                            field.onChange(newValue);
                          }}
                          className="rounded text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{tech}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  {...register('githubUrl')}
                  className="input-field"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  {...register('liveUrl')}
                  className="input-field"
                  placeholder="https://myproject.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Status
              </label>
              <select {...register('status')} className="input-field">
                <option value={PROJECT_STATUS.IDEA}>💡 Idea</option>
                <option value={PROJECT_STATUS.IN_PROGRESS}>🚧 In Progress</option>
                <option value={PROJECT_STATUS.COMPLETED}>✅ Completed</option>
              </select>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...register('lookingForCollaborators')}
                className="mt-1 rounded text-primary-600 focus:ring-primary-500"
              />
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Looking for collaborators
                </label>
                <p className="text-sm text-gray-600">
                  Let others know you're open to collaboration
                </p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 btn-primary flex items-center justify-center"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}