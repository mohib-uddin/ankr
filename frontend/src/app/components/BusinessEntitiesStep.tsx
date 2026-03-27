import { useState } from 'react';
import { TextInput, CurrencyInput, StepHeader, StepActions, AddButton, CardShell, FileUpload } from './FormUI';
import type { FormData, Entity } from '../types';
import { generateId } from '../types';

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BusinessEntitiesStep({ data, onChange, onNext, onBack }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const addEntity = () => {
    const newEntity: Entity = {
      id: generateId(),
      name: '',
      ownershipPercent: '',
      estimatedValue: '',
    };
    onChange({ entities: [...data.entities, newEntity] });
  };

  const updateEntity = (id: string, updates: Partial<Entity>) => {
    onChange({
      entities: data.entities.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  const removeEntity = (id: string) => {
    onChange({ entities: data.entities.filter((e) => e.id !== id) });
  };

  return (
    <div>
      <StepHeader
        stepNumber={4}
        title="Businesses & Entities"
        subtitle="Companies, LLCs, partnerships, or trusts you hold interest in."
      />

      <div className="space-y-4 mb-5">
        {data.entities.map((entity, idx) => (
          <CardShell
            key={entity.id}
            index={idx}
            onRemove={() => removeEntity(entity.id)}
          >
            <div className="space-y-4">
              <TextInput
                label="Entity Name"
                value={entity.name}
                onChange={(v) => updateEntity(entity.id, { name: v })}
                placeholder="e.g. Smith Holdings LLC"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="Ownership %"
                  value={entity.ownershipPercent}
                  onChange={(v) => updateEntity(entity.id, { ownershipPercent: v })}
                  placeholder="e.g. 50"
                />
                <CurrencyInput
                  label="Estimated Value"
                  value={entity.estimatedValue}
                  onChange={(v) => updateEntity(entity.id, { estimatedValue: v })}
                />
              </div>
              <FileUpload
                compact
                selectedFile={uploadedFiles[entity.id] || null}
                onFileSelect={(f) => setUploadedFiles((prev) => ({ ...prev, [entity.id]: f.name }))}
              />
            </div>
          </CardShell>
        ))}
      </div>

      <AddButton onClick={addEntity} label="Add Entity" />

      <StepActions onBack={onBack} onNext={onNext} />
    </div>
  );
}
