import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useCreateProject } from '../../hooks/useProjects';
import { PROJECT_STATUS, TECH_STACK_OPTIONS } from '../../utils/constants';
import Modal from '../common/Modal';

export default function CreateProjectModal({ isOpen, onClose }) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
  const { mutate: createProject, isPending } = useCreateProject();

  const onSubmit = (data) => {
    createProject(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
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
            rows={4}
            className="input-field"
            placeholder="Describe your project..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tech Stack
          </label>
          <Controller
            name="techStack"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {TECH_STACK_OPTIONS.map((tech) => (
                  <label key={tech} className="flex items-center space-x-2 cursor-pointer">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Live URL
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
            Status
          </label>
          <select {...register('status')} className="input-field">
            <option value={PROJECT_STATUS.IDEA}>Idea</option>
            <option value={PROJECT_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={PROJECT_STATUS.COMPLETED}>Completed</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('lookingForCollaborators')}
            className="rounded text-primary-600 focus:ring-primary-500"
          />
          <label className="text-sm text-gray-700">
            Looking for collaborators
          </label>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
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
    </Modal>
  );
}