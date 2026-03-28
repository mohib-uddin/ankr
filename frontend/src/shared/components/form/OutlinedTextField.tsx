import { forwardRef, type CSSProperties, type InputHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import {
  outlinedControlBorderClass,
  outlinedFieldErrorTextClass,
  outlinedInputClassName,
  outlinedLabelClassName,
  outlinedLabelStyle,
} from './outlined-field-tokens';

type LabelProps = {
  /** Overrides default SF Pro label (e.g. Figtree labels on onboarding). */
  labelClassName?: string;
  labelStyle?: CSSProperties;
};

export type OutlinedTextFieldManualProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  label: string;
  error?: string;
  footer?: ReactNode;
  control?: never;
  name?: never;
} & LabelProps;

export type OutlinedTextFieldRhfProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  id: string;
  error?: string;
  footer?: ReactNode;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'ref' | 'className'
> &
  LabelProps;

export type OutlinedTextFieldProps<T extends FieldValues = FieldValues> =
  | OutlinedTextFieldManualProps
  | OutlinedTextFieldRhfProps<T>;

/** @deprecated Use `OutlinedTextFieldProps` with `control` + `name`. */
export type OutlinedTextFieldControlProps<T extends FieldValues> = OutlinedTextFieldRhfProps<T>;

function isRhfProps<T extends FieldValues>(p: OutlinedTextFieldProps<T>): p is OutlinedTextFieldRhfProps<T> {
  return 'control' in p && p.control != null && 'name' in p && p.name != null;
}

type InputShellProps = {
  label: string;
  error?: string;
  footer?: ReactNode;
  id?: string;
  labelClassName?: string;
  labelStyle?: CSSProperties;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  inputRef: React.Ref<HTMLInputElement>;
};

function OutlinedTextFieldShell({
  label,
  error,
  footer,
  id,
  labelClassName,
  labelStyle,
  inputProps,
  inputRef,
}: InputShellProps) {
  const invalid = Boolean(error);
  const errorId = id ? `${id}-error` : undefined;
  const labCn = labelClassName ?? outlinedLabelClassName;
  const labStyle = labelStyle ?? outlinedLabelStyle;

  return (
    <div className="flex flex-col gap-[6px] w-full">
      <label htmlFor={id} className={labCn} style={labStyle}>
        {label}
      </label>
      <div className="bg-white h-[46px] relative rounded-[8px] w-full">
        <input
          id={id}
          aria-invalid={invalid}
          aria-describedby={error ? errorId : undefined}
          className={outlinedInputClassName}
          {...inputProps}
          ref={inputRef}
        />
        <div aria-hidden="true" className={outlinedControlBorderClass(invalid)} />
      </div>
      {error ? (
        <p id={errorId} role="alert" className={outlinedFieldErrorTextClass}>
          {error}
        </p>
      ) : null}
      {footer ? <div className="w-full">{footer}</div> : null}
    </div>
  );
}

const OutlinedTextFieldManualInner = forwardRef<HTMLInputElement, OutlinedTextFieldManualProps>(
  function OutlinedTextFieldManualInner(
    { label, error, footer, id, labelClassName, labelStyle, ...inputProps },
    ref,
  ) {
    return (
      <OutlinedTextFieldShell
        label={label}
        error={error}
        footer={footer}
        id={id}
        labelClassName={labelClassName}
        labelStyle={labelStyle}
        inputProps={inputProps}
        inputRef={ref}
      />
    );
  },
);

function OutlinedTextFieldRhf<T extends FieldValues>({
  control,
  name,
  label,
  id,
  error: errorProp,
  footer,
  labelClassName,
  labelStyle,
  ...inputProps
}: OutlinedTextFieldRhfProps<T>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ control, name });

  const errorMessage = errorProp ?? fieldError?.message;
  const value = field.value;
  const stringValue = typeof value === 'string' ? value : value == null ? '' : String(value);

  return (
    <OutlinedTextFieldShell
      label={label}
      error={errorMessage}
      footer={footer}
      id={id}
      labelClassName={labelClassName}
      labelStyle={labelStyle}
      inputRef={field.ref}
      inputProps={{
        ...inputProps,
        name: field.name,
        value: stringValue,
        onChange: field.onChange,
        onBlur: field.onBlur,
      }}
    />
  );
}

/**
 * Outlined text field (46px): pass **`value` / `onChange`** for controlled usage, or **`control` / `name`** for react-hook-form.
 */
export function OutlinedTextField<T extends FieldValues = FieldValues>(
  props: OutlinedTextFieldProps<T>,
): ReactElement {
  if (isRhfProps(props)) {
    return <OutlinedTextFieldRhf {...props} />;
  }
  return <OutlinedTextFieldManualInner {...props} />;
}

/** @deprecated Use {@link OutlinedTextField} with `control` and `name`. */
export const OutlinedTextFieldControl = OutlinedTextField;

OutlinedTextFieldManualInner.displayName = 'OutlinedTextField';
