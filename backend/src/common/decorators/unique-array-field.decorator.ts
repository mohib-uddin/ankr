import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function UniqueArrayByFieldOrValue(field?: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'UniqueArrayByFieldOrValue',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          if (!Array.isArray(value)) return true; // allow non-arrays to skip validation

          const seen = new Set();
          for (const item of value) {
            const val = field ? item?.[field] : item;
            if (seen.has(val)) return false;
            seen.add(val);
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return field ? `Duplicate values for field '${String(field)}' are not allowed in ${args.property}.` : `Duplicate values are not allowed in ${args.property}.`;
        },
      },
    });
  };
}
