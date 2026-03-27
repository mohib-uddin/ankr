import { TextInput, CurrencyInput, SelectInput, StepHeader, StepActions, AddButton, CardShell, FileUpload } from './FormUI';
import type { FormData, Account } from '@/app/types';
import { generateId } from '@/app/types';
import { useState } from 'react';

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'money_market', label: 'Money Market' },
  { value: 'cd', label: 'Certificate of Deposit' },
  { value: 'brokerage', label: 'Brokerage' },
  { value: 'retirement', label: 'Retirement (IRA/401k)' },
];

export function LiquidityStep({ data, onChange, onNext, onBack }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const addAccount = () => {
    const newAccount: Account = {
      id: generateId(),
      institution: '',
      accountType: '',
      balance: '',
    };
    onChange({ accounts: [...data.accounts, newAccount] });
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    onChange({
      accounts: data.accounts.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    });
  };

  const removeAccount = (id: string) => {
    onChange({ accounts: data.accounts.filter((a) => a.id !== id) });
  };

  return (
    <div>
      <StepHeader
        stepNumber={2}
        title="Liquidity"
        subtitle="Cash, savings, and liquid investment accounts."
      />

      <div className="space-y-4 mb-5">
        {data.accounts.map((account, idx) => (
          <CardShell
            key={account.id}
            index={idx}
            onRemove={() => removeAccount(account.id)}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="Institution"
                  value={account.institution}
                  onChange={(v) => updateAccount(account.id, { institution: v })}
                  placeholder="e.g. Chase, Schwab"
                />
                <SelectInput
                  label="Account Type"
                  value={account.accountType}
                  onChange={(v) => updateAccount(account.id, { accountType: v })}
                  options={ACCOUNT_TYPES}
                />
              </div>
              <div className="sm:w-1/2">
                <CurrencyInput
                  label="Balance"
                  value={account.balance}
                  onChange={(v) => updateAccount(account.id, { balance: v })}
                />
              </div>
              <FileUpload
                compact
                selectedFile={uploadedFiles[account.id] || null}
                onFileSelect={(f) => setUploadedFiles((prev) => ({ ...prev, [account.id]: f.name }))}
              />
            </div>
          </CardShell>
        ))}
      </div>

      <AddButton onClick={addAccount} label="Add Account" />

      <StepActions onBack={onBack} onNext={onNext} />
    </div>
  );
}
